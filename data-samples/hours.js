// This is the market hours data used within Mimir
// "Today" is always the current day
// "Tomorrow" is the next *business* day (Skips weekends)

hours ={
	"today": {
		"date": "2022-11-23",
		"isOpen": true,
		"sessionHours": {
			"preMarket": [
				{
					"start": "2022-11-23T07:00:00-05:00",
					"end": "2022-11-23T09:30:00-05:00"
				}
			],
			"regularMarket": [
				{
					"start": "2022-11-23T09:30:00-05:00",
					"end": "2022-11-23T16:00:00-05:00"
				}
			],
			"postMarket": [
				{
					"start": "2022-11-23T16:00:00-05:00",
					"end": "2022-11-23T20:00:00-05:00"
				}
			]
		}
	},
	"tomorrow": {
		"date": "2022-11-24",
		"isOpen": false,
		"sessionHours": null
	}
}
