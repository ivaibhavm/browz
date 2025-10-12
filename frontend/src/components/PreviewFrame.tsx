import type { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

interface PreviewFrameProps {
    webContainer: WebContainer
}
const PreviewFrame = ( {webContainer} : PreviewFrameProps) => {
    const [url, setUrl] = useState("")

    useEffect( () => {
        async function run(){
            const installProcess = await webContainer.spawn('npm', ['install']);
            installProcess.output.pipeTo(new WritableStream({
                write(data) {
                  console.log(data);
                }
              }));
            
            const installExitCode = await installProcess.exit;

            if (installExitCode !== 0) {
                throw new Error('Unable to run npm install');
            }

            await webContainer.spawn('npm', ['run', 'dev']);

            webContainer.on('server-ready', (port, url) => {
                setUrl(url)
            });
        }
        run()
    }, [webContainer])
    
    return (
        <>
            {url? <iframe className="w-full h-full" src={url} /> : <h2 className="text-white flex justify-center items-center h-full bg-red">Loading Preview....</h2>}
        </>
    )
}

export default PreviewFrame