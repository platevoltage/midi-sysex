import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, Button } from '@mui/material'

function App() {
  const [deviceList, setDeviceList] = useState<IteratorYieldResult<MIDIInput>[]>([]);
  const [deviceId, setDeviceId] = useState("0");
  const [device, setDevice] = useState<MIDIInput>();
  const [channel, setChannel] = useState(1);
  const [priority, setPriority] = useState(0);
  const [root, setRoot] = useState(0);

  useEffect(() => {
    const _deviceList = [];
    (async () =>  {
      const midi = await navigator.requestMIDIAccess();
      const _devices = midi.inputs.values();
      console.log(_devices);
      for (let _device = _devices.next(); _device && !_device.done; _device = _devices.next()) {
        _deviceList.push(_device);
      }
      console.log(_deviceList);
      setDeviceList(_deviceList);
    })();
  },[]);

  useEffect(() => {
    (async () =>  {
      const midi = await navigator.requestMIDIAccess();
      const _device = midi.inputs.get(deviceId);
      if (_device) {
        setDevice(_device);
        // Connect to the selected MIDI device
        // _device.onmidimessage = onMIDIMessage;
        console.log('Connected to MIDI device:', _device.name);
        // alert('Connected to MIDI device: ' + _device.name);
      } else {
        // console.error('MIDI device not found:', selectedDeviceId);
        alert('MIDI device not found. Check console for details.');
      }
    })();
  },[deviceId]);

  useEffect(() => {
    console.log(device);
  },[device]);

  const handleDeviceChange = (event: SelectChangeEvent) => {
    const _device = event.target.value;
    setDeviceId(_device);
    console.log(_device);
  };

  const handleChannelChange = (event: SelectChangeEvent) => {
    setChannel(+event.target.value);
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(+event.target.value);
  };

  const handleRootChange = (event: SelectChangeEvent) => {
    setRoot(+event.target.value);
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


  return (
    <main>
      <ThemeProvider theme={theme}>

        <Box sx={{ minWidth: 120, padding: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Device</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={deviceId.toString()}
              label="Device"
              onChange={handleDeviceChange}
            >
              {
                deviceList.map((device) =>
                  <MenuItem value={device.value.id}>{device.value.name}</MenuItem>
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
              label="Priority"
              onChange={handlePriorityChange}
            >
              <MenuItem value={0}>Low Note (0)</MenuItem>
              <MenuItem value={1}>High Note (1)</MenuItem>
              <MenuItem value={2}>Last Note (2)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 150, padding: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Root Octave</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={root.toString()}
              label="Root-Octave"
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


        <Box sx={{ minWidth: 120, padding: 1 }}>
          Bootloader<br></br>
          <Button variant="contained">Reboot</Button>
        </Box>

        <Box sx={{ minWidth: 120, padding: 1 }}>
          Calibration<br></br>
          <Button variant="contained">Calibration</Button>
        </Box>

      </ThemeProvider>
    </main>
  )
}

export default App
