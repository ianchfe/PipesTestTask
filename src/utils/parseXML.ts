import { XMLParser } from 'fast-xml-parser';

export async function parseWindows1251Xml(file: File): Promise<any> {
    const arrayBuffer = await file.arrayBuffer();

    const decoder = new TextDecoder('windows-1251');
    const decodedText = decoder.decode(arrayBuffer);

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
    });

    const json = parser.parse(decodedText);
    return json;
}
