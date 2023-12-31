import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, Button, IconButton } from "@mui/material";
import Logo from "./assets/logo.png";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
    const [deviceList, setDeviceList] = useState<MIDIOutput[]>([]);
    const [deviceId, setDeviceId] = useState("");
    const [device, setDevice] = useState<MIDIOutput>();
    const [channel, setChannel] = useState("");
    const [priority, setPriority] = useState("");
    const [root, setRoot] = useState("");

    const getDeviceList = useCallback(async () => {
        try {
            const _deviceList = [];
            const midi = await navigator.requestMIDIAccess({sysex: true});
            const _devices = midi.outputs.values();
            for (const _device of _devices) {
                _deviceList.push(_device);
            }
            setDeviceList(_deviceList);
            if (_deviceList.length > 0) {
                setDeviceId(_deviceList[0].id);
            }
        } catch (e) {
            console.error(e);
            toast.error("ERROR: Could not get MIDI devices, make sure you are using a WebMIDI compatible browser.");
        }
    }, []);

    const connectToDevice = useCallback(async () => {
        const midi = await navigator.requestMIDIAccess({sysex: true});
        const _device = midi.outputs.get(deviceId);
        if (_device) {
            setDevice(_device);
            toast.success("Connected to MIDI device: " + _device.name);
        } else {
            console.error("MIDI device not found:", deviceId);
            toast.error("ERROR: MIDI device not found. Check console for details.");
        }
    }, [deviceId]);

    useEffect(() => {
        getDeviceList();
    }, [getDeviceList]);

    useEffect(() => {
        if (deviceId !== "") {
            connectToDevice();
        }
    }, [deviceId, connectToDevice]);

    function byteLog(array: number[]) {
        let string = "";
        for (const byte of array) {
            string += byte.toString(16).padStart(2,"0")  + " ";
        }
        string = string.toUpperCase();
        console.log(string);
        toast.success("SysEx sent: " + string);
    }

    function sendSysEx(sysExData: number[]) {
        if (device) {
            const sysExArray = Uint8Array.from(sysExData);
            byteLog(sysExData);
            device.send(sysExArray);
            return true;
        } else {
            toast.error("ERROR: No Device Selected");
            return false;
        }
    }

    function handleDeviceChange(event: SelectChangeEvent) {
        const _device = event.target.value;
        setDeviceId(_device);
    }

    function handleChannelChange(event: SelectChangeEvent) {
        const _channel = event.target.value;
        const success = sendSysEx([0xF0, 0x7D, 0x08, 0x10, 0x0C, +_channel-1, 0xF7]);
        if (success) setChannel(_channel);
    }

    function handlePriorityChange(event: SelectChangeEvent) {
        const _priority = event.target.value;
        const success = sendSysEx([0xF0, 0x7D, 0x08, 0x10, 0x0E, +_priority, 0xF7]);
        if (success) setPriority(_priority);
    }

    function handleRootChange(event: SelectChangeEvent) {
        const _root = event.target.value;
        const success = sendSysEx([0xF0, 0x7D, 0x08, 0x10, 0x0D, +_root, 0xF7]);
        if (success) setRoot(_root);
    }

    function handleReboot() {
        sendSysEx([0xF0, 0x7D, 0x08, 0x10, 0x0B, 0xF7]);
    }

    function handleCalibration() {
        sendSysEx([0xF0, 0x7D, 0x08, 0x10, 0x0F, 0xF7]);
    }

    function handleQuickCalibration() {
        sendSysEx([0xF0, 0x7D, 0x08, 0x10, 0x0A, 0xF7]);
    }

    return (
        <main>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img src={Logo} alt="Michigan Synth Works logo" style={{ width: 200, margin: "1em" }}/>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", margin: 0 }}>
                <span>MSW-810 Synthesizer MIDI configuration</span>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center"}}>
                <span style={{ fontWeight: 700, fontSize: ".8em" }}>USE USB MIDI ONLY TO CONNECT</span>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ paddingTop: 3, margin: 0 }}>
                    <IconButton onClick={getDeviceList}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                    </IconButton>
                </Box>
                <Box sx={{ minWidth: 180, paddingTop: 2, paddingRight: 2, paddingLeft: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Device</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={deviceId === "" ? "" : deviceId}
                            label="Device"
                            onChange={handleDeviceChange}
                        >
                            {
                                deviceList.map((device, i) =>
                                    <MenuItem key={i} value={device.id}>{device.name}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 120, padding: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Channel</InputLabel>
                        <Select  
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={channel.toString()}
                            label="Channel"
                            onChange={handleChannelChange}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={16}>16</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 150, padding: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Note Priority</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={priority.toString()}
                            label="Note Priority"
                            onChange={handlePriorityChange}
                        >
                            <MenuItem value={0}>Low Note (0)</MenuItem>
                            <MenuItem value={1}>High Note (1)</MenuItem>
                            <MenuItem value={2}>Last Note (2)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 140, padding: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Root Octave</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={root.toString()}
                            label="Root Octave"
                            onChange={handleRootChange}
                        >
                            <MenuItem value={0}>0</MenuItem>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>

                <Box sx={{ minWidth: 120, padding: 1 }}>
                    <Button variant="contained" onClick={handleReboot}>Reboot to Bootloader</Button>
                </Box>

                <Box sx={{ minWidth: 120, padding: 1 }}>
                    <Button variant="contained" onClick={handleCalibration}>Calibration</Button>
                </Box>

                <Box sx={{ minWidth: 120, padding: 1 }}>
                    <Button variant="contained" onClick={handleQuickCalibration}>Quick Calibration</Button>
                </Box>

            </Box>

            <ToastContainer theme="dark" autoClose={2000}/>
        </main>
    );
}

export default App;
