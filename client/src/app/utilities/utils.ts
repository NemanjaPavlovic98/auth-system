export function parseWebAPIErrors(response: any): string[] {
    const result: string[] = [];

    if (response.error){
        if (typeof response.error === 'string'){
            result.push(response.error);
        } else if (Array.isArray(response.error)) {
            response.error.forEach(value => result.push(value.description));
        } else{
            const mapErrors = response.error.errors;
            const entries = Object.entries(mapErrors);
            entries.forEach((arr: any[]) => {
                const field = arr[0];
                arr[1].forEach(errorMessage => {
                    result.push(`${field}: ${errorMessage}`);
                })
            })
        }
    }

    return result;
}