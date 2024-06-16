export const minusculaAcentos = (str) => {


    if (null) {

        return ""
    }
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};