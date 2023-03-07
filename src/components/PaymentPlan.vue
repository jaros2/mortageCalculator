<template>
    <div>
        <section>
            <table class="payment-plan">
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
                    <tr class="payment-plan-row" v-for="(payment, index) in payments" :key="index">
                        <td class="payment-plan-cell">{{ payment.paymentNumber }}</td>
                        <td class="payment-plan-cell">{{ payment.monthName }}</td>
                        <td class="payment-plan-cell">{{ payment.paymentAmount }}</td>
                        <td class="payment-plan-cell">{{ payment.interestPayment }}</td>
                        <td class="payment-plan-cell">{{ payment.principalPayment }}</td>
                        <td class="payment-plan-cell"> <input class="payment-plan-input" step="1000" min="0" type="number"
                                :name="'OP' + payment.paymentNumber" :value="payment.overpayment"
                                @change="modifyOverPayments($event)">
                        </td>
                        <td class="payment-plan-cell">{{ payment.balance }}</td>
                    </tr>

                </tbody>
            </table>
        </section>
    </div>
</template>

<script>
export default {
    name: 'PaymentPlan',
    props: {
        payments: Object,
        

    },    
    data() {
        return {
            aTable: [],

        }
    },
    methods: {
        modifyOverPayments(event) {
            this.$emit('modified-op', event)
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

<style scoped>
.payment-plan {
  width: 70rem;
}

.payment-plan th {
  height: 1.7rem;
  padding: 1.2rem;
  font-style: bold;
  color: #282828
}

.payment-plan-row td {
  text-align: right;
}

table,
th,
td {
  border: none;
  border-bottom: 1px solid #c1c5c3;
  border-collapse: collapse;
  background-color: rgb(218, 240, 240);
  padding: 1rem;
  color: #222
}


.payment-plan tbody tr:nth-child(odd) td {
  background-color: white;
  color: #222
}

form.payment-plan td.form-payment-cell input {
  text-align: right;
  color: rgb(164, 164, 164)
}

input[type="number"] {
    text-align: right;
}
</style>