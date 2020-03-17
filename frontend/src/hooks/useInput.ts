import { useState } from 'react';

export const useInput = (initialValue: string = '') => {
    const [input, setInput] = useState<string>(initialValue);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    return {
        input,
        setInput,
        onInputChange
    }
}
