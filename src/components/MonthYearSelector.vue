<template>
    <div class="form-group">
        <label>{{ title }}</label>
        <div class="date-select">
            <select name="monthSelect" id="monthSelect" @change="$emit('value-changed', currentValue)"
                :value="selectedMonth">
                <option v-for="(month, index) in months" :key="index" :value='index'>{{ month }}</option>
            </select>
            <select name="yearSelect" id="yearSelect" @change="$emit('value-changed', currentValue)" :value="selectedYear">
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
                'Październik', 'Listopad', 'Grudzień']

        }
    },
    props: {
        title: String,
        selectedDate: {
            type: Date,
            default: new Date()
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
        },
        selectedMonth() { return this.selectedDate.getMonth() },
        selectedYear() { return this.selectedDate.getFullYear() }

    },

}
</script>

<style></style>