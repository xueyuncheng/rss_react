'use client'
import React, { useState, useEffect } from 'react';

type Props = {};

const Password = (props: Props) => {
    const [password, setPassword] = useState('');
    const [copied, setCopied] = useState(false);

    const generateRandomPassword = () => {
        const length = 16;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let newPassword = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            newPassword += charset.charAt(Math.floor(Math.random() * n));
        }
        setPassword(newPassword);
    };

    useEffect(() => {
        generateRandomPassword();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Hide the message after 2 seconds
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full relative">
                <h1 className="text-2xl font-bold mb-6 text-center">Password Generator</h1>
                <div>
                    <label className="form-control w-full mb-4">
                        <div className="label">
                            <span className="label-text">密码</span>
                        </div>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={password}
                            readOnly
                        />
                    </label>
                    <div className="flex justify-end space-x-2">
                        <button className="btn btn-sm" onClick={generateRandomPassword}>
                            重新生成
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={handleCopy}
                        >
                            复制
                        </button>
                    </div>
                    {copied && (
                        <div className="absolute top-0 right-0 mt-2 mr-2 bg-green-100 text-green-700 p-2 rounded">
                            密码已复制到剪贴板
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Password;
