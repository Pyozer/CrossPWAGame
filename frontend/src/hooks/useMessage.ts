import { useState } from 'react';
import { Message } from '../models/Message';

export const useMessage = () => {
    const [message, setMessage] = useState<Message>();

    const setSuccessMsg = (msg: string) => {
        setMessage({ msg, isSuccess: true });
    }
    const setErrorMsg = (msg: string) => {
        setMessage({ msg, isSuccess: false });
    }

    return {
        message,
        setSuccessMsg,
        setErrorMsg
    };
}
