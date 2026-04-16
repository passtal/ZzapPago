import {useState, useRef, useCallback} from 'react'

interface UseVoiceRecorderReturn {
    isRecording : boolean;
    audioBlob : Blob | null;
    startRecording : () => Promise<void>;
    stopRecording : () => void;
    reset : () => void;
}

export default function useVoiceRecorder() : UseVoiceRecorderReturn {
    const [isRecording, setIsRecodring] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio : true});

        // 브라우저가 지원하는 mimeType 자동 선택
        const mimeType = [
            "audio/webm;codecs=opus",
            "audio/webm",
            "audio/ogg;codecs=opus",
            "audio/mp4",
        ].find((t) => MediaRecorder.isTypeSupported(t));

        const options = mimeType ? { mimeType } : undefined;
        const mediaRecorder = new MediaRecorder(stream, options);

        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, {type : "audio/webm"});
            setAudioBlob(blob);
            stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecodring(true);
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecodring(false);
        }
    }, []);

    const reset = useCallback(() => {
        setAudioBlob(null);
        chunksRef.current = [];
    }, []);

    return {isRecording, audioBlob, startRecording, stopRecording, reset};
}