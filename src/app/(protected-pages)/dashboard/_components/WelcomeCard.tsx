'use client'

import React from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { FaRegClock } from 'react-icons/fa'

import moment from "moment";
import "moment/locale/id";

const WelcomeCard = () => {
    const { session } = useCurrentSession()

    const today = moment().locale("id").format("dddd, DD MMMM YYYY");
    const fullName = `${session?.user?.profile.first_name} ${session?.user?.profile.last_name}`

    console.log('session', session)

    return (
        <Card
            bordered={false}
            className=" relative bg-primary shadow-lg min-h-[250px] overflow-hidden flex items-center"
        >
            <div className="">
                <h2 className="text-[#00438c] mb-2">Hello, {fullName}!</h2>
                <p className="text-white  mb-6">
                    Welcome to this dashboard!
                </p>
                <div className=" flex items-center gap-2">
                    <FaRegClock className=" text-white w-4 h-4" />
                    <p className="text-white  font-semibold">
                        {today}
                    </p>
                </div>
            </div>
            <div className=" absolute bottom-0 right-0 ">
                <Image
                    src={'/img/icon/welcome.png'}
                    alt="welcome icon"
                    width={300}
                    height={200}
                />
            </div>
        </Card>
    )
}

export default WelcomeCard
