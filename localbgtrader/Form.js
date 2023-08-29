import React from "react";
import { createStyles, rem, Select, TextInput, Button, ButtonGroup, } from '@mantine/core';
import styled from '@emotion/styled';

function getIsValidUSZip(sZip) {
  return /^\d{5}(-\d{4})?$/.test(sZip);
}

const StyledButtonGroup = styled(ButtonGroup)({
  marginTop: "12px",
});

class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      country: "US",
      zipcode: "",
      radius: "5",
      username: "",
      lastLogin: "none",
    };
  }

  handleChange = (event) => {
    const name = event.target.name;

    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmitSellers = () => {
    this.props.onSubmit({
      type: "sellers",
      ...this.state,
    });
  };

  render() {
    const { country, zipcode } = this.state;
    const isValidUSZip = country === "US" ? getIsValidUSZip(zipcode) : true;
    const isSubmitDisabled = !isValidUSZip || !zipcode || this.props.isLoading;

    return (
      <form noValidate>
        <div style={{ paddingBottom: "8px" }}>
          <Select
            value={this.state.country}
            onChange={this.handleChange}
            inputProps={{
              name: "country",
            }}
          >
            <MenuItem value="US">United States</MenuItem>
            <MenuItem value="AD">Andorra</MenuItem>
            <MenuItem value="AR">Argentina</MenuItem>
            <MenuItem value="AS">American Samoa</MenuItem>
            <MenuItem value="AT">Austria</MenuItem>
            <MenuItem value="AU">Australia</MenuItem>
            <MenuItem value="AX">Åland</MenuItem>
            <MenuItem value="BD">Bangladesh</MenuItem>
            <MenuItem value="BE">Belgium</MenuItem>
            <MenuItem value="BG">Bulgaria</MenuItem>
            <MenuItem value="BR">Brazil</MenuItem>
            <MenuItem value="CA">Canada</MenuItem>
            <MenuItem value="CH">Switzerland</MenuItem>
            <MenuItem value="CZ">Czech Republic</MenuItem>
            <MenuItem value="DE">Germany</MenuItem>
            <MenuItem value="DK">Denmark</MenuItem>
            <MenuItem value="DO">Dominican Republic</MenuItem>
            <MenuItem value="DZ">Algeria</MenuItem>
            <MenuItem value="ES">Spain</MenuItem>
            <MenuItem value="FI">Finland</MenuItem>
            <MenuItem value="FO">Faroe Islands</MenuItem>
            <MenuItem value="FR">France</MenuItem>
            <MenuItem value="GB">United Kingdom</MenuItem>
            <MenuItem value="GF">French Guiana</MenuItem>
            <MenuItem value="GG">Guernsey</MenuItem>
            <MenuItem value="GL">Greenland</MenuItem>
            <MenuItem value="GP">Guadeloupe</MenuItem>
            <MenuItem value="GR">Greece</MenuItem>
            <MenuItem value="GT">Guatemala</MenuItem>
            <MenuItem value="GU">Guam</MenuItem>
            <MenuItem value="HR">Croatia</MenuItem>
            <MenuItem value="HU">Hungary</MenuItem>
            <MenuItem value="IM">Isle of Man</MenuItem>
            <MenuItem value="IN">India</MenuItem>
            <MenuItem value="IS">Iceland</MenuItem>
            <MenuItem value="IT">Italy</MenuItem>
            <MenuItem value="JE">Jersey</MenuItem>
            <MenuItem value="JP">Japan</MenuItem>
            <MenuItem value="LI">Liechtenstein</MenuItem>
            <MenuItem value="LK">Sri Lanka</MenuItem>
            <MenuItem value="LT">Lithuania</MenuItem>
            <MenuItem value="LU">Luxembourg</MenuItem>
            <MenuItem value="MC">Monaco</MenuItem>
            <MenuItem value="MD">Moldova</MenuItem>
            <MenuItem value="MH">Marshall Islands</MenuItem>
            <MenuItem value="MK">Macedonia</MenuItem>
            <MenuItem value="MP">Northern Mariana Islands</MenuItem>
            <MenuItem value="MQ">Martinique</MenuItem>
            <MenuItem value="MX">Mexico</MenuItem>
            <MenuItem value="MY">Malaysia</MenuItem>
            <MenuItem value="NL">Netherlands</MenuItem>
            <MenuItem value="NO">Norway</MenuItem>
            <MenuItem value="NZ">New Zealand</MenuItem>
            <MenuItem value="PH">Philippines</MenuItem>
            <MenuItem value="PK">Pakistan</MenuItem>
            <MenuItem value="PL">Poland</MenuItem>
            <MenuItem value="PM">Saint Pierre and Miquelon</MenuItem>
            <MenuItem value="PR">Puerto Rico</MenuItem>
            <MenuItem value="PT">Portugal</MenuItem>
            <MenuItem value="RE">Réunion</MenuItem>
            <MenuItem value="RO">Romania</MenuItem>
            <MenuItem value="RU">Russia</MenuItem>
            <MenuItem value="SE">Sweden</MenuItem>
            <MenuItem value="SI">Slovenia</MenuItem>
            <MenuItem value="SJ">Svalbard and Jan Mayen</MenuItem>
            <MenuItem value="SK">Slovakia</MenuItem>
            <MenuItem value="SM">San Marino</MenuItem>
            <MenuItem value="TH">Thailand</MenuItem>
            <MenuItem value="TR">Turkey</MenuItem>
            <MenuItem value="VA">Vatican City</MenuItem>
            <MenuItem value="VI">U.S. Virgin Islands</MenuItem>
            <MenuItem value="YT">Mayotte</MenuItem>
            <MenuItem value="ZA">South Africa</MenuItem>
          </Select>
        </div>
        <div style={{ paddingBottom: "8px" }}>
          <Input
            inputProps={{
              name: "zipcode",
            }}
            onChange={this.handleChange}
            placeholder="Zip code"
            value={this.state.zipcode}
          />
        </div>
        <div style={{ paddingBottom: "8px" }}>
          <Select
            value={this.state.radius}
            onChange={this.handleChange}
            inputProps={{
              name: "radius",
            }}
          >
            <MenuItem value={5}>5 miles</MenuItem>
            <MenuItem value={10}>10 miles</MenuItem>
            <MenuItem value={25}>25 miles</MenuItem>
          </Select>
        </div>
        <div style={{ paddingBottom: "8px" }}>
          <Input
            placeholder="Your BGG Username"
            value={this.state.username}
            onChange={this.handleChange}
            inputProps={{ name: "username" }}
          />
        </div>
        <div style={{ paddingBottom: "8px" }}>
          <Select
            value={this.state.lastLogin}
            onChange={this.handleChange}
            inputProps={{ name: "lastLogin" }}
          >
            <MenuItem value="none">All time</MenuItem>
            <MenuItem value="7">7 days</MenuItem>
            <MenuItem value="30">30 days</MenuItem>
            <MenuItem value="90">90 days</MenuItem>
          </Select>
        </div>
        <div style={{ paddingBottom: "8px" }}>
          <StyledButtonGroup disableElevation>
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitDisabled}
              onClick={() => {
                this.props.onSubmit({
                  type: "buyers",
                  ...this.state,
                });
              }}
            >
              Find buyers
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitDisabled}
              onClick={this.handleSubmitSellers}
            >
              Find sellers
            </Button>
          </StyledButtonGroup>
        </div>
      </form>
    );
  }
}

export default Form;
