import React from "react";
import { Component } from "react";
import "./ContactData.css";
import axios from "../../../axios-orders";
// import Spinner
import * as actionTypes from '../../../store/actions/index'
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import {connect} from 'react-redux';
// import Input
import Input from "../../../components/UI/Input/Input";

// import ErrorHandler
import ErrorHandler from '../../../hoc/ErrorHandler/ErrorHandler';
class ContactData extends Component {
  state = {
    loading: false,
    orderForm: {
      name: {
        elementtype: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
          autoComplete: "off",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },

      street: {
        elementtype: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
          autoComplete: "off",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementtype: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP Code",
          autoComplete: "off",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementtype: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
          autoComplete: "off",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },

      email: {
        elementtype: "email",
        elementConfig: {
          type: "text",
          placeholder: "Your Mail",
          autoComplete: "off",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },

      deliveryMethod: {
        elementtype: "select",
        elementConfig: {
          options: [
            {
              value: "fastest",
              displayValue: "Fastest",
            },
            {
              value: "cheapest",
              displayValue: "Cheapest",
            },
          ],
        },
        value: "fastest",
        validation:{},
        valid: true
      },
    },
    formIsValid: false
  };
  clickHandler = (event) => {
    event.preventDefault();
    console.log(this.props.ings);
  
    const formData = {};

    for (let key in this.state.orderForm) {
      formData[key] = this.state.orderForm[key].value;
    }

    const order = {
      ingradients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId
    };

    this.props.onOrder(order, this.props.token);

  };
  inputChange = (event, indentifier) => {
   
    const updatedForm = {
      ...this.state.orderForm,
    };
    const updatedValue = {
      ...updatedForm[indentifier],
    };

    updatedValue.value = event.target.value;
    updatedValue.valid = this.checkValidity(
      updatedValue.value,
      updatedValue.validation
    );
    updatedValue.touched = true;
    // console.log(updatedValue);
    updatedForm[indentifier] = updatedValue;
    let formIsValid = true;
    for(let key in updatedForm)
    {
      formIsValid = updatedForm[key].valid && formIsValid;
    }

    this.setState({
      orderForm: updatedForm,
      formIsValid: formIsValid
    });
  };
  checkValidity = (value, rules) => {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    return isValid;
  };
  render() {
    const formArray = [];

    for (let key in this.state.orderForm) {
      formArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form onSubmit={this.clickHandler}>
        {formArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementtype={formElement.config.elementtype}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            label={formElement.id.toUpperCase()}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChange(event, formElement.id)}
          ></Input>
        ))}
        <Button btnType="Success"
         clicked={this.clickHandler}
         disabled={!this.state.formIsValid}>
          Order
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className="contactdata">
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}
const mapStateToProps = state =>{
  return{
    ings: state.burgerBuilder.ingradients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId 
  }
}
const mapDispatchToProps = dispatch =>{
  return{
   
    onOrder: (orderData, token) => dispatch(actionTypes.purchaseStart(orderData, token))

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorHandler(ContactData, axios));
