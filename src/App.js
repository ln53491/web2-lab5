import React, {useEffect, useState} from "react";
import "./App.css"
import InstallIcon from './InstallIcon'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useAddToHomescreenPrompt } from "./AddToHomeScreen";
import Background from "./Background";
import axios from "axios";
import addNotification from 'react-push-notification';

export default function App() {
    const [prompt, promptToInstall] = useAddToHomescreenPrompt();
    const [allowed, setAllowed] = useState(true);
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint = 800;

    useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);

    useEffect(() => {
        try {
            navigator.mediaDevices.getUserMedia({audio: true}).then();
        } catch (error) {
            setAllowed(false);
        }
    }, []);

    const setData = (blob) => {
        const data = {
            size: blob.size
        }
        axios.post('https://jsonplaceholder.typicode.com/posts', data)
            .then(r => sendPushSaved(r.data))
            .catch(() => {
                navigator.serviceWorker.ready(serviceWorkerRegistration => {
                    serviceWorkerRegistration.sync.register('sync-data');
                });
            });
    }

    const sendPushSaved = (data) => {
        addNotification({
            title: 'Audio successfully saved!',
            message: `Id: ${data.id}\nSize: ${data.size}B`,
            native: true
        });
    };

    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        const divider = document.createElement("div");
        divider.className = "divider";
        audio.src = url;
        audio.controls = true;
        const recorder = document.getElementById("recorder");
        while (recorder.childNodes.length > 1) {
            recorder.removeChild(recorder.lastChild);
        }
        recorder.appendChild(divider)
        recorder.appendChild(audio);
        setData(blob);
    };

    return (
          <div className="center-div">
              <Background/>
              <div className="container-div">
                  <div className="title">
                      AUDIO RECORDER PWA
                  </div>
                  <div className="desc">
                      TAP TO RECORD AUDIO
                  </div>
                  <div className="recorder" id="recorder">
                      {allowed ?
                          <AudioRecorder
                              onRecordingComplete={addAudioElement}
                              audioTrackConstraints={{
                                  noiseSuppression: true,
                                  echoCancellation: true,
                              }}
                              downloadOnSavePress={true}
                              downloadFileExtension="webm"
                              showVisualizer={true}
                          /> :
                          <div className="desc">
                              Recording isn't supported on your device.
                          </div>
                      }
                  </div>
                  <div className="desc">
                      Using <b>Web Audio API</b> and <b>MediaRecorder</b>
                  </div>
                  <div className="title-2" onClick={promptToInstall}>
                      <InstallIcon className="icon"/>
                      {width > breakpoint ?
                          <div className="padding">
                              INSTALL THIS APP TO HOME SCREEN
                          </div> :
                          <div className="padding">
                              INSTALL TO HOME SCREEN
                          </div>
                      }
                  </div>
              </div>
              <div className="credits">
                  created by Luka Nestić for the purpose of WEB2 laboratory project as a demonstration of Progressive Web Applications
              </div>
          </div>
      );
}
