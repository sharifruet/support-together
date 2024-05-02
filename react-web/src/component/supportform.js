import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

export default function SupportForm() {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
          />
        </Grid>
        <Grid item sm={6}>
          <TextField
            required
            id="emailAddress"
            name="emailAddress"
            label="Email"
            fullWidth
            autoComplete="emailAddress"
            variant="standard"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            id="subject"
            name="subject"
            label="Subject"
            fullWidth
            autoComplete="subject"
            variant="standard"
          />
        </Grid>
        <Grid item xs={4} >
            <TextField
                id="topic"
                name="topic"
                label="Topic"
                fullWidth
                variant="standard"
            />
        </Grid>
        <Grid item xs={4}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Priority</InputLabel>
                <Select label="Priority" name="priority" id="priority">
                    <MenuItem value={1}>High</MenuItem>
                    <MenuItem value={2}>Medium</MenuItem>
                    <MenuItem value={3}>Low</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={4} >
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Department</InputLabel>
                <Select label="Department" name="department" id="department">
                    <MenuItem value={1}>Sales Department</MenuItem>
                    <MenuItem value={2}>Technical Support</MenuItem>
                    <MenuItem value={3}>Billing Department</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="message"
            name="message"
            label="Message"
            fullWidth
            autoComplete="Message"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
            <button className='btn btn-primary'>Submit</button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
