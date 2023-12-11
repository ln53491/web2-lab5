import React from "react";
import "./App.css"
import InstallIcon from './InstallIcon'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useAddToHomescreenPrompt } from "./AddToHomeScreen";
import Background from "./Background";

export default function App() {
    const [prompt, promptToInstall] = useAddToHomescreenPrompt();
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
                      <AudioRecorder
                          onRecordingComplete={addAudioElement}
                          audioTrackConstraints={{
                              noiseSuppression: true,
                              echoCancellation: true,
                          }}
                          downloadOnSavePress={true}
                          downloadFileExtension="webm"
                          showVisualizer={true}
                      />
                  </div>
                  <div className="desc">
                      Using <b>Web Audio API</b> and <b>MediaRecorder</b>
                  </div>
                  <div className="title-2" onClick={promptToInstall}>
                      <InstallIcon className="icon"/>
                      <div className="padding">
                          INSTALL THIS APP TO HOME SCREEN
                      </div>
                  </div>
              </div>
          </div>
      );
}
