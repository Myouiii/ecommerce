import PropTypes from 'prop-types';
// material
import { Autocomplete, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
// ----------------------------------------------------------------------

WardPicker.propTypes = {
  getFieldProps: PropTypes.func,
  touched: PropTypes.any,
  errors: PropTypes.any,
  label: PropTypes.string.isRequired,
  districtCode: PropTypes.any,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

WardPicker.defaultProps = {
  districtCode: null,
  value: ''
};

export default function WardPicker({ getFieldProps, touched, errors, label, districtCode, value, onChange, ...other }) {
  const [allWards, setAllWards] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    axios
      .get(`https://provinces.open-api.vn/api/w/`)
      .then((res) => {
        setAllWards(res.data);
        const listWards = res.data.filter((w) => w.district_code === districtCode);
        setWards(listWards);
      })
      .catch((error) => console.log(error));
  }, [districtCode]);

  const handleOnChange = (option, value) => {
    const defaultValue = wards.find((sub) => sub?.name === value.name);
    onChange(defaultValue);
  };

  return (
    <Autocomplete
      options={wards.map((w) => ({ name: w.name }))}
      value={wards.find((w) => w.name === value) || null}
      onChange={(option, value) => handleOnChange(option, value)}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          margin="none"
          {...getFieldProps('ward')}
          error={Boolean(touched.ward && errors.ward)}
          helperText={touched.ward && errors.ward}
        />
      )}
      {...other}
      isOptionEqualToValue={(option, value) => value === undefined || value === '' || option.id === value.id}
    />
  );
}
