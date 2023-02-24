<template>
    <div class="form-group">
        <label>{{ title }}</label>

        <label for="monthSelect">Miesiąc:</label>
        <select name="monthSelect" id="monthSelect">
            <option v-for="(month, index) in months" :key="index" :value='index'>{{ month }}</option>
        </select>

        <label for="yearSelect">Rok:</label>
        <select name="yearSelect" id="yearSelect">
            <option v-for="(year, index) in years" :key="index" :value='year'>{{ year }}</option>
        </select>
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
        title: String
    },
    computed: {
        years() {
            let range = (start, stop) => [...Array(stop).keys()].slice(start);
            const currYear = new Date().getFullYear()
            return range(currYear, currYear + 40)
        }
    },

}
</script>

<style></style>