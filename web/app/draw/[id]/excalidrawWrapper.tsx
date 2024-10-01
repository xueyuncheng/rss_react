'use client'
import { Excalidraw } from '@excalidraw/excalidraw'
import { serializeAsJSON, getSceneVersion } from '@excalidraw/excalidraw'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { DefaultFetcher, Response } from '../../config/config'
import { useParams } from 'next/navigation'

type Draw = {
    id: number
    name: string
    data: string
}

const ExcalidrawWrapper = () => {
    const [lastSceneVersion, setLastSceneVersion] = useState(0)

    const params = useParams<{ id: string }>()
    const { data, error } = useSWR<Response<Draw>>(
        `/draws/${params.id}`,
        DefaultFetcher
    )

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    const initialData = JSON.parse(data.data.data)

    const handleChange = async (
        elements: readonly ExcalidrawElement[],
        appState: AppState,
        files: BinaryFiles
    ) => {
        const currentSceneVersion = getSceneVersion(elements)
        if (currentSceneVersion === lastSceneVersion) {
            // scene version has not changed, just return
            return
        }

        // only when keyboard or pointer is released
        if (
            appState.draggingElement !== null ||
            appState.resizingElement !== null
        ) {
            return
        }

        console.log('Scene version has changed')
        setLastSceneVersion(currentSceneVersion)

        const req: Draw = {
            id: data.data.id,
            name: data.data.name,
            data: serializeAsJSON(elements, appState, files, 'database'),
        }

        try {
            const response = await DefaultFetcher(`/draws/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
            })
        } catch (error) {
            console.error('Error saving scene', error)
        }

        // mutate(`/api/draws/${params.id}`)
    }

    return (
        <div>
            <div className="h-screen">
                {/* <Excalidraw initialData={initialData} onChange={handleChange} /> */}
                <Excalidraw initialData={initialData} />
            </div>
        </div>
    )
}
export default ExcalidrawWrapper
