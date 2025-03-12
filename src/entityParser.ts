export class EntityParser {
    static extractPackageName(content: string): string {
        const packageLine = content.split('\n').find(line => line.trim().startsWith('package '));
        if (!packageLine) {
            throw new Error('No se pudo encontrar la declaración del paquete en el archivo.');
        }
        return packageLine.replace('package ', '').replace(';', '').trim();
    }

    static extractAttributes(content: string): Array<{ type: string; name: string }> {
        const attributes: Array<{ type: string; name: string }> = [];
        content.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('private ')) {
                const tokens = trimmedLine.split(' ');
                if (tokens.length >= 3) {
                    const type = tokens[1];
                    const name = tokens[2].replace(';', '');
                    attributes.push({ type, name });
                }
            }
        });
        return attributes;
    }
}
