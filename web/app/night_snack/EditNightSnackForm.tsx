'use client'
import React, { useState } from 'react';
import { mutate } from 'swr';

type NightSnack = {
    id: number;
    name: string;
    weight: number;
};

type EditNightSnackFormProps = {
    snack: NightSnack;
    onClose: () => void;
};

const EditNightSnackForm = ({ snack, onClose }: EditNightSnackFormProps) => {
    const [name, setName] = useState<string>(snack.name);
    const [weight, setWeight] = useState<number>(snack.weight);

    const handleEditNightSnack = async () => {
        const response = await fetch(`/api/night_snacks/${snack.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: snack.id, name: name, weight: weight }),
        });
        if (!response.ok) {
            console.error('Error editing option');
        } else {
            onClose();
            mutate('/api/night_snacks');
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mt-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">编辑选项</h2>
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
                <button className="btn btn-primary w-full" onClick={handleEditNightSnack}>
                    保存
                </button>
                <button className="btn w-full" onClick={onClose}>
                    取消
                </button>
            </div>
        </div>
    );
};

export default EditNightSnackForm;