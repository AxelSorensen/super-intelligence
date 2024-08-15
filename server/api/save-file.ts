import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    try {
        // Get the JSON body from the request
        const body = await readBody(event);

        // Define the file path

        // Write the JSON data to the file
        fs.writeFileSync('/Users/axelsorensen/Projects/superintelligence/nodes.json', JSON.stringify(body, null, 2), 'utf8');

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});