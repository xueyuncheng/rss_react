'use client'
import React from 'react';

type NightSnack = {
    id: number;
    name: string;
    weight: number;
};

type ListProps = {
    night_snacks: NightSnack[];
    onDelete: (id: number) => void;
    onEdit: (snack: NightSnack) => void;
};

const List = ({ night_snacks, onDelete, onEdit }: ListProps) => {
    return (
        <table className="table w-full">
            <thead>
                <tr>
                    <th className="px-4 py-2 text-center">序号</th>
                    <th className="px-4 py-2 text-center">选项</th>
                    <th className="px-4 py-2 text-center">权重</th>
                    <th className="px-4 py-2 text-center">操作</th>
                </tr>
            </thead>
            <tbody>
                {night_snacks.map((snack, index) => (
                    <tr key={snack.id}>
                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                        <td className="border px-4 py-2 text-center">{snack.name}</td>
                        <td className="border px-4 py-2 text-center">{snack.weight}</td>
                        <td className="flex justify-center space-x-2 border px-4 py-2">
                            <button className="btn btn-sm btn-primary" onClick={() => onEdit(snack)}>编辑</button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDelete(snack.id)}>删除</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default List;