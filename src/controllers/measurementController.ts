import { Request, Response } from "express";
import Measurement from "../models/measurement";
import { constants } from "crypto";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isBase64, isValidDate, isValidMeasureType, isValidCustomerCode, isNumeric } from '../utils/validation';
import * as fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("API key is not defined. Please set GEMINI_API_KEY environment variable.");
}

export const uploadMeasurement = async (req: Request, res: Response) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    const fileManager = new GoogleAIFileManager(apiKey);

    if (!image || !customer_code || !measure_datetime || !measure_type) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'MISSING DATA' });
    }

    if (!isBase64(image)) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'INVALID FORMAT IN IMAGE' });
    }

    if (!isValidCustomerCode(customer_code)) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'INVALID FORMAT IN CUSTOMER CODE' });
    }

    if (!isValidDate(measure_datetime)) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'INVALID FORMAT IN DATE' });
    }

    if (!isValidMeasureType(measure_type)) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'INVALID FORMAT IN MEASURE TYPE (ACCEPT ONLY WATER OR GAS)' });
    }

    const existingMeasurement = await Measurement.findOne({
        where: { customer_code: customer_code, measure_type: measure_type, measure_datetime: measure_datetime },
    });
    
    if (existingMeasurement) {
        return res.status(409).json({ error_code: 'DOUBLE_REPORT', error_description: 'Measurement of the month already done' })
    }

    const matches = image.match(/^data:image\/(\w+);base64,/);
    if (!matches || matches.length !== 2) {
        return res.status(400).send('Invalid image format.');
    }

    const extension = matches[1];
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const tempFilePath = path.join(__dirname, `${customer_code}_${measure_datetime}.${extension}`);

    fs.writeFileSync(tempFilePath, buffer)

    const uploadResult = await fileManager.uploadFile(tempFilePath, {
        mimeType: `image/${extension}`,
        displayName: `${customer_code}_${measure_datetime}.${extension}`,
    });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const result = await model.generateContent([
        {
        fileData: {
            mimeType: uploadResult.file.mimeType,
            fileUri: uploadResult.file.uri
        }
        },
        { text: "Read the number on this marker. Return only the integer result, without any text, just the number. If no value is found, return the number zero" },
    ]);

    const measure_value = parseInt(result.response.text())

    const measurement = await Measurement.create({
        customer_code,
        measure_datetime,
        measure_type,
        measure_value,
        image_url: uploadResult.file.uri,
      });

    return res.json({
        image_url: measurement.image_url,
        measure_value: measurement.measure_value,
        measure_uuid: measurement.id,
    });
}

export const confirmMeasurement = async (req: Request, res: Response) => {
    const { measure_uuid, confirmed_value } = req.body;
  
    if (!measure_uuid || confirmed_value === undefined) {
      return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'MISSING DATA' });
    }
    
    const uuid_regex = /^[a-z,0-9,-]{36,36}$/

    if(!uuid_regex.test(measure_uuid)) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'INVALID FORMAT IN UUID CODE' });
    }

    if(!isNumeric(confirmed_value)) {
        return res.status(400).json({ error_code: 'INVALID_DATA', error_description: 'INVALID FORMAT IN CONFIRMED VALUE (ONLY NUMERIC VALUE)' });
    }

    const measurement = await Measurement.findByPk(measure_uuid);
  
    if (!measurement) {
      return res.status(404).json({ error_code: 'MEASURE_NOT_FOUND', error_description: 'MONTH MEASURE NOT FOUND' });
    }
  
    if (measurement.has_confirmed) {
      return res.status(409).json({ error_code: 'CONFIRMATION_DUPLICATE', error_description: 'MEASURE ALREADY CONFIRMED' });
    }
  
    measurement.measure_value = confirmed_value;
    measurement.has_confirmed = true;
    await measurement.save();
  
    return res.status(200).json({ success: true });
};

export const listMeasurements = async (req: Request, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;
  
    if (measure_type && !['WATER', 'GAS'].includes((measure_type as string).toUpperCase())) {
      return res.status(400).json({ error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida' });
    }
  
    const whereCondition: any = { customer_code };
    if (measure_type) {
      whereCondition.measure_type = (measure_type as string).toUpperCase();
    }
  
    const measurements = await Measurement.findAll({ where: whereCondition });
  
    if (measurements.length === 0) {
      return res.status(404).json({ error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada' });
    }
  
    return res.status(200).json({
      customer_code,
      measures: measurements.map((m) => ({
        measure_uuid: m.id,
        measure_datetime: m.measure_datetime,
        measure_type: m.measure_type,
        has_confirmed: m.has_confirmed,
        image_url: m.image_url,
      })),
    });
};