interface PreviewFrameProps {
    url: string;
    status: "idle" | "installing" | "starting" | "ready" | "error";
}

const PreviewFrame = ({ url, status }: PreviewFrameProps) => {
    if (url) {
        return <iframe className="w-full h-full" src={url} />;
    }

    const messages: Record<string, string> = {
        idle: "Waiting to start…",
        installing: "Installing dependencies…",
        starting: "Starting dev server…",
        ready: "Loading…",
        error: "Something went wrong.",
    };

    return (
        <h2 className="text-white flex justify-center items-center h-full gap-2">
            {status !== "error" && (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            {messages[status] ?? "Loading Preview"}
        </h2>
    );
};

export default PreviewFrame;