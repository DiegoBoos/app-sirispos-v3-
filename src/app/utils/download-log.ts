import { InfoProcessImport } from "../interface";

export const downloadLog = (info: InfoProcessImport) => {

    // Format countRecordsNotProcess and countRecordsProcess
    const countRecordsProcessLine = `Procesados = ${info.countRecordsProcess}`;
    const countRecordsNotProcessLine = `Errores = ${info.countRecordsNotProcess}`;

    // Format importErrors
    let count = 1;
    const lenMaxConsec = info.countRecordsNotProcess.toString().length;

    const importErrorsLines = info.importErrors.map((error) => {
        const consec = count++;
        const lenConsec = consec.toString().length;
        const desiredLength = lenMaxConsec - lenConsec;
        const stringConsec = `${' '.repeat(desiredLength)}${consec.toString()}`;

        return `${stringConsec}. Tipo Error: ${error.type} | Error: ${error.description}`;
    });

    const formattedText = `${countRecordsNotProcessLine}\n${countRecordsProcessLine}\n\n¡¡Detalle errores!!\n\n${importErrorsLines.join('\n')}`;

    const blob = new Blob([formattedText], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'log.txt';
    link.click();

    URL.revokeObjectURL(url);
}
