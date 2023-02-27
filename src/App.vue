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
        <MonthYearSelector title="Data nastepnej raty:" @value-changed="nextPaymentDateChange" />
        
        <label for="remaining-payments">Liczba rat:</label>
        <input type="number" id="remaining-payments" name="remaining-payments" v-model="remainingPayments" @change="remainingPaymentsChange">
        <span>lub </span>
        <MonthYearSelector title="Data ostatniej raty:" @value-changed="lastPaymentDateChange" />
        
      </div>
      <div class="form-group">
        <span class="op-options">Opcje nadpłaty:</span>
        <input type="radio" name="OverpayOptions" id="variableOverpay" v-model="opType" value="variableOp">
        <label class="form-check-label" for="variableOverpay">
          Nadpłacaj kwotę aby rata całkowita była stała w każdym miesiącu
        </label>

        <input type="radio" name="OverpayOptions" id="fixedOverpay" v-model="opType" value="fixedOp">
        <label class="form-check-label" for="fixedOverpay">
          Nadpłacaj taką samą kwotę
        </label>
        <input type="number" id="op-amount" v-model="opAmount" name="op-amount">
      </div>
      <button type="submit">Calculate</button>
    </form>
    <div v-if="showTable">
      <section>
        <p>Odsetki całkowite: {{ totalInterest }}</p>

        <table>
          <thead>
            <tr>
              <th>Nr raty</th>
              <th>Miesiąc</th>
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
              <td>Miesiąc x</td>
              <td>{{ payment.paymentAmount }}</td>
              <td>{{ payment.interestPayment }}</td>
              <td>{{ payment.principalPayment }}</td>
              <td> <input type="number" :name="'OP' + payment.paymentNumber" :value="payment.overpayment"
                  @change="modifyoverPayments($event)"> </td>
              <td>{{ payment.balance }}</td>
            </tr>
            
          </tbody>
        </table>
      </section>
    </div>

  </div>
</template>

<script>
import {monthDiff} from './funcLib.js';
import MonthYearSelector from './components/MonthYearSelector.vue'

export default {
  name: 'App',
  components: {
    MonthYearSelector
  },
  data() {
    return {
      page_title: 'Kalkulator Kredytu',
      loanAmount: 244050,
      interestRate: 9.52,
      payments: [],
      remainingPayments: 195,
      nextPaymentDate: undefined,
      lastPaymentDate: undefined,
      overPayments: {},
      opAmount: 0,
      opType: "variableOp"
    }
  },
  methods: {
    onSubmit() {
      this.overPayments = {}
      this.payments = this.calculatePayments()
    },
    modifyoverPayments(event) {
      this.overPayments[event.target.name] = event.target.value;
      this.payments = this.calculatePayments()
    },
    calculatePayments() {
      const monthlyInterestRate = this.interestRate / 1200;

      const payments = [];

      let loanAmount = this.loanAmount;
      let remainingPayments = this.remainingPayments;

      for (let i = 1; i <= this.remainingPayments; i++) {
        const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -(remainingPayments - i + 1)));
        const interestPayment = loanAmount * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;

        let overpayment;
        //calculate overpayment using user selected options
        if (this.opType == "variableOp") {
          overpayment = this.opAmount - monthlyPayment
        } else if (this.opType == "fixedOp") {
          overpayment = this.opAmount
        }
        if (this.overPayments !== undefined) {
          overpayment = Number(this.overPayments['OP' + i]) || overpayment
        }

        const balance = loanAmount - principalPayment - overpayment;
        const payment = {
          paymentNumber: i,
          paymentAmount: monthlyPayment.toFixed(2),
          interestPayment: interestPayment.toFixed(2),
          principalPayment: principalPayment.toFixed(2),
          overpayment: overpayment.toFixed(2),
          balance: balance.toFixed(2)
        };
        payments.push(payment);
        loanAmount = balance;
        if (loanAmount < 0) { break }

      }

      return payments;
    },
    remainingPaymentsChange(newPaymentNo) {
      this.remainingPayments = newPaymentNo
      this.lastPaymentDate = new Date(this.nextPaymentDate).setMonth(this.nextPaymentDate.getMonth() + newPaymentNo)
    },
    lastPaymentDateChange(newDate) {
      this.lastPaymentDate = newDate
      this.remainingPayments = monthDiff(this.nextPaymentDate, this.lastPaymentDate)
    },
    nextPaymentDateChange(newDate) {
      this.nextPaymentDate = newDate
      this.remainingPayments = monthDiff(this.nextPaymentDate, this.lastPaymentDate)
    }


  },
  computed: {
    showTable() { return this.payments.length > 0 },
    totalInterest() { 
      let totInterest = 0;
      try {
        totInterest = this.payments.map(item => parseFloat(item.interestPayment)).reduce((prev, next) => prev + next);
      } finally {
        return totInterest;
      } 
      
    }
    
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


div {

  margin-bottom: 10px;
}

label {
  margin-right: 10px;
  width: 100px;
  /* Set the width of the labels to the same value */
}

input {

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
