"use client"
import React, { useState, useEffect } from 'react'

import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai'

// interface FullScreenProps {
//     children: React.ReactNode
// }

const FullScreen = () => {
    const [isFullScreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullScreenChange)
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullScreenChange,
            )
        }
    }, [])

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(
                    `Error attempting to enable full-screen mode: ${err.message}`,
                )
            })
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }

    return (
        <button onClick={toggleFullScreen}>
            {isFullScreen ? (
                <AiOutlineFullscreenExit className="w-6 h-6" />
            ) : (
                <AiOutlineFullscreen className="w-6 h-6" />
            )}
        </button>
    )
}

export default FullScreen
