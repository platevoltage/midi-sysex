import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, Button, Alert } from '@mui/material'
import Logo from './assets/logo.png'

function App() {
  const [deviceList, setDeviceList] = useState<IteratorYieldResult<MIDIOutput>[]>([]);
  const [deviceId, setDeviceId] = useState<string>("0");
  const [device, setDevice] = useState<MIDIOutput>();
  const [channel, setChannel] = useState(1);
  const [priority, setPriority] = useState(0);
  const [root, setRoot] = useState(0);
  const [alert, setAlert] = useState<null | string>(null);

  useEffect(() => {
    const _deviceList = [];
    (async () =>  {
      const midi = await navigator.requestMIDIAccess({sysex: true});
      const _devices = midi.outputs.values();
      // console.log(_devices);
      for (let _device = _devices.next(); _device && !_device.done; _device = _devices.next()) {
        _deviceList.push(_device);
      }
      console.log(_deviceList);
      setDeviceList(_deviceList);
      if (_deviceList.length > 0) {
        setDeviceId(_deviceList[0].value.id);
      }
    })();
  },[]);

  useEffect(() => {
    if (deviceId !== "0") {
      (async () =>  {
        const midi = await navigator.requestMIDIAccess({sysex: true});
        // const permissions = await navigator.permissions.query({name: "midi", sysex: true});
        // console.log(permissions);
        const _device = midi.outputs.get(deviceId);
        if (_device) {
          setDevice(_device);
          // Connect to the selected MIDI device
          // _device.onmidimessage = onMIDIMessage;
          console.log('Connected to MIDI device:', _device.name);
          // alert('Connected to MIDI device: ' + _device.name);
        } else {
          // console.error('MIDI device not found:', selectedDeviceId);
          // alert('MIDI device not found. Check console for details.');
        }
      })();
    }
  },[deviceId]);

  useEffect(() => {
    // console.log(device);
  },[device]);

  function byteLog(array: number[]) {
    let string = "";
    for (const byte of array) {
      string += byte.toString(16).padStart(2,"0")  + " ";
    }
    string = string.toUpperCase();
    console.log(string);
    setAlert("Sysex sent: " + string);
  }

  const handleDeviceChange = (event: SelectChangeEvent) => {
    const _device = event.target.value;
    setDeviceId(_device);
    // console.log(_device);
  };

  const handleChannelChange = (event: SelectChangeEvent) => {
    const _channel = +event.target.value;
    setChannel(_channel);
    if (device) {
      const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0C, _channel-1, 0xF7];
      const sysExArray = Uint8Array.from(sysExData);
      byteLog(sysExData);
      device.send(sysExArray);
    }

  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    const _priority = +event.target.value;
    setPriority(_priority);
    if (device) {
      const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0E, _priority, 0xF7];
      const sysExArray = Uint8Array.from(sysExData);
      byteLog(sysExData);
      device.send(sysExArray);
    }
  };

  const handleRootChange = (event: SelectChangeEvent) => {
    const _root = +event.target.value;
    setRoot(_root);
    if (device) {
      const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0D, _root, 0xF7];
      const sysExArray = Uint8Array.from(sysExData);
      byteLog(sysExData);
      device.send(sysExArray);
    }
  };

  const handleReboot = () => {
    // console.log(device);
    if (device) {
      const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0B, 0xF7];
      const sysExArray = Uint8Array.from(sysExData);
      byteLog(sysExData);
      device.send(sysExArray);
    }
  }
  const handleCalibration = () => {
    // console.log(device);
    if (device) {
      const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0F, 0xF7];
      const sysExArray = Uint8Array.from(sysExData);
      byteLog(sysExData);
      device.send(sysExArray);
    }
  }
  const handleQuickCalibration = () => {
    // console.log(device);
    if (device) {
      const sysExData = [0xF0, 0x7D, 0x08, 0x10, 0x0A, 0xF7];
      const sysExArray = Uint8Array.from(sysExData);
      byteLog(sysExData);
      device.send(sysExArray);
    }
  }
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


  return (
    <main>
      <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", justifyContent: "center"}}>
      <img src={Logo} alt="" style={{width: 200, margin: "1em"}}/>
      </Box>
        <Box sx={{ display: "flex", justifyContent: "center"}}>
        <Box sx={{ minWidth: 180, padding: 2 }}>
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
                // <div key={i}>
                  <MenuItem key={i} value={device.value.id}>{device.value.name}</MenuItem>
                // </div>
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

        {alert && <Alert severity="info">
          {alert}
        </Alert>}

      </ThemeProvider>
    </main>
  )
}

export default App
