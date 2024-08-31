export const isBase64 = (str: string): boolean => {
    const regex = /^data:image\/(png|jpeg|jpg);base64,/;
    return regex.test(str);
};

export const isValidDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};

export const isValidMeasureType = (type: string): boolean => {
    return ['WATER', 'GAS'].includes(type.toUpperCase());
};

export const isValidCustomerCode = (code: string): boolean => {
    // Verificar se o código do cliente segue o formato esperado
    const regex = /^[A-Za-z0-9]+$/;  // Ajuste o regex conforme necessário
    return regex.test(code);
};

export const isNumeric = (num: number) => { 
    return !isNaN(num);
}