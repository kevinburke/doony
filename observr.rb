#!/usr/bin/env observr

watch('src/theme.js') { puts "\033[31mCompiling javascript\033[0m"; system("make js") }
watch('src/doony.scss') { puts "\033[31mCompiling css\033[0m"; system("make css") }
