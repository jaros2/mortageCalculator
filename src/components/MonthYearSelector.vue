<template>
    <div class="form-group">
        <label>{{ title }}</label>
        <div class="date-select">
            <select name="monthSelect" id="monthSelect" v-model="selectedMonth">
                <option v-for="(month, index) in months" :key="index" :value='index'>{{ month }}</option>
            </select>
            <select name="yearSelect" id="yearSelect"  v-model="selectedYear">
                <option v-for="(year, index) in years" :key="index" :value='year'>{{ year }}</option>
            </select>
        </div>

    </div>
</template>

<script>
export default {
    name: 'MonthYearSelector',
    data() {
        return {
            months: ['Styczeń', 'Luty', 'Marzec',
                'Kwiecień', 'Maj', 'Czerwiec',
                'Lipiec', 'Sierpień', 'Wrzesień',
                'Październik', 'Listopad', 'Grudzień'],
            selectedMonth: this.initialDate.getMonth(),
            selectedYear: this.initialDate.getFullYear()

        }
    },
    props: {
        title: String,
        initialDate: {
            type: Date,
            default: new Date()
        }

    },
    watch: {
        initialDate() {
            this.updateSelectedValues()
        },
        selectedMonth() {
            this.emitDate()
        },
        selectedYear() {
            this.emitDate()
        }
    },
    computed: {
        years() {
            let range = (start, stop) => [...Array(stop).keys()].slice(start);
            const currYear = new Date().getFullYear()
            return range(currYear, currYear + 40)
        },
        currentValue() {
            return new Date(this.selectedYear, this.selectedMonth)
        }

    },
    methods: {
        emitDate() {
            if (this.selectedMonth !== null && this.selectedYear !== null) {
                const date = new Date(this.selectedYear, this.selectedMonth, 1)
                this.$emit('value-changed', date)
            }
        },
        updateSelectedValues() {
            if (this.initialDate !== null) {
                this.selectedMonth = this.initialDate.getMonth()
                this.selectedYear = this.initialDate.getFullYear()
            }
        }
    }

}
</script>

<style></style>