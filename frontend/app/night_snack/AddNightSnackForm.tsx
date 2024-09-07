'use client'
import React, { useState } from 'react';
import { mutate } from 'swr';

type NightSnack = {
    name: string;
    weight: number;
};

type AddNightSnackFormProps = {
    onClose: () => void;
};

const AddNightSnackForm = ({ onClose }: AddNightSnackFormProps) => {
    const [name, setName] = useState<string>('');
    const [weight, setWeight] = useState<number>(100);

    const handleAddNightSnack = async () => {
        const newSnack: NightSnack = {
            name: name,
            weight: weight,
        };
        const response = await fetch('/api/night_snacks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSnack),
        });
        if (!response.ok) {
            console.error('Error adding option');
        } else {
            mutate('/api/night_snacks');
            setName('');
            setWeight(100);
            onClose();
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">添加新夜宵</h2>
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="选项名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="权重"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                />
                <button className="btn btn-primary w-full" onClick={handleAddNightSnack}>
                    添加
                </button>
            </div>
        </div>
    );
};

export default AddNightSnackForm;