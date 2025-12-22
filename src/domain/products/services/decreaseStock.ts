// Nota: el backend no expone endpoint para decrementar stock incrementalmente.
// Mantenemos un stub para evitar llamadas erróneas.
export const decreaseStock = async (): Promise<never> => {
    throw new Error("decreaseStock no está soportado por la API; usa updateStock con valor absoluto");
};
