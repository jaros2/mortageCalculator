<template>
  <div>
    <h1 v-text="page_title"></h1>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="loan-amount">Kwota kredytu:</label>
        <input type="number" id="loan-amount" name="loan-amount" v-model="loanAmount" required>
      </div>

      <div class="form-group">
        <label for="interest-rate">Oprocentowanie:</label>
        <input type="number" id="interest-rate" name="interest-rate" v-model="interestRate" step="0.01" required>
      </div>
      <div class="form-group">
        <label for="remaining-payments">Liczba rat:</label>
        <input type="number" id="remaining-payments" name="remaining-payments" v-model="remainingPayments" required>
      </div>
      <div class="form-group">
        <span class="op-options">Opcje nadpłaty:</span>
        <input type="radio" name="OverpayOptions" id="variableOverpay" value="variablOp" checked>
        <label class="form-check-label" for="variableOverpay">
          Nadpłacaj kwotę aby rata całkowita była stała w każdym miesiącu
        </label>

        <input type="radio" name="OverpayOptions" id="fixedOverpay" value="fixedOp">
        <label class="form-check-label" for="fixedOverpay">
          Nadpłacaj o taką samą kwotę
        </label>
        <input type="number" id="op-amount" name="op-amount">
      </div>
      <button type="submit">Calculate</button>
    </form>
    <div v-if="showTable">
      <table>
        <thead>
          <tr>
            <th>Nr raty</th>
            <th>Rata</th>
            <th>Rata odsetki</th>
            <th>Rata kapitał</th>
            <th>Nadpłata</th>
            <th>Saldo pozostałe</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in payments" :key="index">
            <td>{{ payment.paymentNumber }}</td>
            <td>{{ payment.paymentAmount }}</td>
            <td>{{ payment.interestPayment }}</td>
            <td>{{ payment.principalPayment }}</td>
            <td> <input type="number" :name="'OP' + payment.paymentNumber" :value="payment.overpayment"
                @change="modifyOverpayments($event)"> </td>
            <td>{{ payment.balance }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import { calculatePayments, calculateMothlyPayment } from './calculatePayments.js'


export default {
  name: 'App',
  data() {
    return {
      page_title: 'Kalkulator Kredytu',
      loanAmount: 244050,
      interestRate: 9.52,
      remainingPayments: 195,
      payments: [],
      overpayments: {}

    }
  },
  methods: {
    onSubmit() {
      this.payments = calculatePayments(this.loanAmount, this.interestRate, this.remainingPayments, this.overpayments)
    },
    modifyOverpayments(event) {
      this.overpayments[event.target.name] = event.target.value;
      this.payments = calculatePayments(this.loanAmount, this.interestRate, this.remainingPayments, this.overpayments)

    }


  },
  computed: {
    showTable() { return this.payments.length > 0 }
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: #2c3e50;
  margin-top: 20px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

div {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

label {
  margin-right: 10px;
  width: 100px; /* Set the width of the labels to the same value */
}

input {
  flex: 1; /* Make the input fill the remaining space */
  padding: 5px;
}

button {
  margin-top: 10px;
}

.form-group {
  display: block;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
