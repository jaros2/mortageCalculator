<template>
  <div>
    <h1 v-text="page_title"></h1>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="row">
        <div class="form-group">
          <label class="row " for="loan-amount">Kwota kredytu:</label>
          <input class="row" type="number" id="loan-amount" name="loan-amount" v-model="loanAmount" step="10000" required>
        </div>
        <div class="form-group">
          <label class="row" for="interest-rate ">Oprocentowanie:</label>
          <input class="row" type="number" id="interest-rate" name="interest-rate" v-model="interestRate" step="0.01"
            required>
        </div>

        <div class="form-group">
          <label class="row"> Data nastepnej raty:</label>
          <MonthYearSelector title="" @value-changed="nextPaymentDateChange" :initial-date="nextPaymentDate" />
        </div>

        <div class="form-group">
          <label class="row"> Data ostatniej raty:</label>
          <MonthYearSelector title="" @value-changed="lastPaymentDateChange" :initial-date="lastPaymentDate" />
          <span>lub </span><label for="remaining-payments">liczba pozostałych rat:</label><input type="number"
            id="remaining-payments" name="remaining-payments" v-model="remainingPayments"
            @change="remainingPaymentsChange">
        </div>

        <div class="form-group">
          <label class="row"> Opcje nadpłaty:</label>
          <div class="form-group">
            <input type="radio" name="OverpayOptions" id="fixedOverpay" v-model="opType"
              value="fixedOp">
            <label class="form-check-label" for="fixedOverpay">
              Nadpłacaj taką samą kwotę
            </label>
            <input type="number" id="op-amount" v-model="opAmount" name="op-amount">
          </div>
        </div>
        <div class="form-group">
          <input type="radio" name="OverpayOptions" id="variableOverpay" v-model="opType" value="variableOp">
          <label class="form-check-label" for="variableOverpay">
            Nadpłacaj kwotę aby rata całkowita była stała w każdym miesiącu
          </label>
          <input type="number" id="op-amount" v-model="opAmount" name="op-amount">
        </div>
      </div>

      <button type="submit">Calculate</button>
    </form>
  </div>

  <p>Odsetki całkowite: {{ totalInterest.toFixed(0) }}</p>
  <PaymentPlan v-if=showTable :payments="payments" :totalInterest="totalInterest" @modified-op="modifyOverPayments" />
</template>

<script>
import { monthDiff, addMonthsToDate, formatDate } from './funcLib.js';
import MonthYearSelector from './components/MonthYearSelector.vue'
import PaymentPlan from './components/PaymentPlan.vue'

export default {
  name: 'App',
  components: {
    MonthYearSelector, PaymentPlan
  },
  data() {
    return {
      page_title: 'Kalkulator Kredytu',
      loanAmount: 244050,
      interestRate: 9.52,
      payments: [],
      remainingPayments: 195,
      nextPaymentDate: new Date(),
      lastPaymentDate: new Date(new Date().getFullYear() + 30, 1, 1),
      overPayments: {},
      opAmount: 0,
      opType: "fixedOp"
    }
  },
  mounted() {
    this.remainingPayments = monthDiff(this.nextPaymentDate, this.lastPaymentDate)
  },
  methods: {
    onSubmit() {
      this.overPayments = {}
      this.payments = this.calculatePayments()
    },
    modifyOverPayments(event) {
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
        const monthName = formatDate(addMonthsToDate(this.nextPaymentDate, i - 1));

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
          monthName: monthName,
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
    remainingPaymentsChange(ev) {
      this.remainingPayments = ev.target.value
      this.lastPaymentDate = addMonthsToDate(this.nextPaymentDate, this.remainingPayments)

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
* {
  font-size: 1rem;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1rem;
  color: #2c3e50;
  margin-top: 0.2em;
}

.row {
  display: flex;
  padding: 0 1rem;
}

.col {
  flex: 35%;
  float: left;
  padding: 0 1rem;
}

.row:after {
  content: "";
  display: table;
  clear: both;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right
}




div {

  margin-bottom: .5rem;
}

form {
  font-family: Arial, sans-serif;
  width: 75%;
}

/* Style form labels */
label {

  margin-bottom: 5px;
}

/* Style form input fields */
input[type="number"],
select {
  padding: 5px;
  width: 200px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 1em;
  display: block;
}

/* Style form select boxes */
select {

  margin-right: 10px;
  display: block;
}

/* Style form submit button */
input[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
}
</style>
