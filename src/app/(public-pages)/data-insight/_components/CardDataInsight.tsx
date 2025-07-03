import React, { ReactNode } from 'react'

type CardDataInsightProps = {
    title: string
    children: ReactNode
}

const CardDataInsight: React.FC<CardDataInsightProps> = ({
    title,
    children,
}) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {title}
            </h2>
            <div className="">
                {children}
            </div>
        </div>
    )
}

export default CardDataInsight
