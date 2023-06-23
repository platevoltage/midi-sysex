import { useState, useEffect, useCallback } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, Button, IconButton } from "@mui/material";
import Logo from "./assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [deviceList, setDeviceList] = useState<IteratorYieldResult<MIDIOutput>[]>([]);
    const [deviceId, setDeviceId] = useState<string>("0");
    const [device, setDevice] = useState<MIDIOutput>();
    const [channel, setChannel] = useState(1);
    const [priority, setPriority] = useState(0);
    const [root, setRoot] = useState(0);


    const getDeviceList = useCallback(async () => {
        const _deviceList = [];
        try {
            const midi = await navigator.requestMIDIAccess({sysex: true});
            const _devices = midi.outputs.values();
            for (let _device = _devices.next(); _device && !_device.done; _device = _devices.next()) {
                _deviceList.push(_device);
            }
            console.log(_deviceList);
            setDeviceList(_deviceList);
            if (_deviceList.length > 0) {
                setDeviceId(_deviceList[0].value.id);
            }
        } catch (e) {
            console.error(e);
            toast.error("Could not get MIDI devices, make sure you are using a WebMIDI compatible browser.");
        }
    },[]);


    useEffect(() => {
        getDeviceList();
    },[getDeviceList]);

    const getDevice = useCallback(async () => {
        const midi = await navigator.requestMIDIAccess({sysex: true});
        const _device = midi.outputs.get(deviceId);
        if (_device) {
            setDevice(_device);
            // Connect to the selected MIDI device
            console.log("Connected to MIDI device:", _device.name);
            toast.success("Connected to MIDI device: " + _device.name);
        } else {
            console.error("MIDI device not found:", deviceId);
            toast.error("MIDI device not found. Check console for details.");
        }
    },[deviceId]);

    useEffect(() => {
        if (deviceId !== "0") {
            getDevice();
        }
    },[deviceId, getDevice]);

    function byteLog(array: number[]) {
        let string = "";
        for (const byte of array) {
            string += byte.toString(16).padStart(2,"0")  + " ";
        }
        string = string.toUpperCase();
        console.log(string);
        toast.success("Sysex sent: " + string);
    }

    function handleDeviceChange(event: SelectChangeEvent) {
        const _device = event.target.value;
        setDeviceId(_device);
    }

    function handleChannelChange(event: SelectChangeEvent) {
        const _channel = +event.target.value;
        setChannel(_channel);
        if (device) {
            const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0C, _channel - 1, 0xF7];
            const sysExArray = Uint8Array.from(sysExData);
            byteLog(sysExData);
            device.send(sysExArray);
        }
    }

    function handlePriorityChange(event: SelectChangeEvent) {
        const _priority = +event.target.value;
        setPriority(_priority);
        if (device) {
            const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0E, _priority, 0xF7];
            const sysExArray = Uint8Array.from(sysExData);
            byteLog(sysExData);
            device.send(sysExArray);
        }
    }

    function handleRootChange(event: SelectChangeEvent) {
        const _root = +event.target.value;
        setRoot(_root);
        if (device) {
            const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0D, _root, 0xF7];
            const sysExArray = Uint8Array.from(sysExData);
            byteLog(sysExData);
            device.send(sysExArray);
        }
    }

    function handleReboot() {
        if (device) {
            const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0B, 0xF7];
            const sysExArray = Uint8Array.from(sysExData);
            byteLog(sysExData);
            device.send(sysExArray);
        }
    }
    function handleCalibration() {
        if (device) {
            const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0F, 0xF7];
            const sysExArray = Uint8Array.from(sysExData);
            byteLog(sysExData);
            device.send(sysExArray);
        }
    }
    function handleQuickCalibration() {
        if (device) {
            const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0A, 0xF7];
            const sysExArray = Uint8Array.from(sysExData);
            byteLog(sysExData);
            device.send(sysExArray);
        }
    }
    const theme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: "#fad761",
            },
        },
    });

    return (
        <main>
            <ThemeProvider theme={theme}>
                <Box sx={{ display: "flex", justifyContent: "center"}}>
                    <img src={Logo} alt="" style={{width: 200, margin: "1em"}}/>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center"}}>
                    <Box sx={{ paddingTop: 3, margin: 0 }}>
                        <IconButton onClick={getDeviceList}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
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
                                value={deviceId === "0" ? "" : deviceId}
                                label="Device"
                                onChange={handleDeviceChange}
                            >
                                {
                                    deviceList.map((device, i) =>
                                        <MenuItem key={i} value={device.value.id}>{device.value.name}</MenuItem>
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

                    <Box sx={{ minWidth: 280, padding: 2 }}>
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

                    <Box sx={{ minWidth: 120, padding: 2 }}>
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
                <Box sx={{ display: "flex", justifyContent: "center"}}>

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
            </ThemeProvider>
        </main>
    );
}

export default App;
