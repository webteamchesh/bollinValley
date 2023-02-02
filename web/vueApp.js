var app = new Vue({
  el: "#vueApp",
  data() {
    return {
      accessToken: "QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I",
      linkDepth: 5, // leave at 5 if unsure.
      rangerPage:
        "https://www.cheshireeast.gov.uk/leisure,_culture_and_tourism/ranger_service/ranger_events/ranger-event-listings.aspx?event=",
      url: "https://cms-chesheast.cloud.contensis.com/api/delivery/projects/",
      events: undefined,
      item: undefined,
      fromDate: "",
      toDate: "",
      dateOptions: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
      rxDate: /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?(?:\.\d*)?Z?$/,
    };
  },
  methods: {
    sortObjDate: function () {
      return (a, b) => {
        return a.dateStartEnd.from - b.dateStartEnd.from;
      };
    },
    createDates: function (arr) {
      return arr.map((e) => {
        return Object.fromEntries(
          Object.entries(e).map(([k, v]) => {
            if (k.toLowerCase().includes("date")) {
              if (typeof v === "string" && v.match(this.rxDate)) {
                return [k, new Date(v)];
              } else if (typeof v === "object") {
                try {
                  return [
                    k,
                    {
                      from: new Date(v["from"]),
                      to: new Date(v["to"]),
                    },
                  ];
                } catch (err) {
                  return [k, v];
                }
              }
            } else {
              return [k, v];
            }
          })
        );
      });
    },
    formatDate: function (value) {
      return value.toLocaleString("en-GB", this.dateOptions);
    },
    filterByLocation: function (arr, loc) {
      return arr.filter((e) => e.specificLocation === loc);
    },
    getTime: function (value) {
      let time = value.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      if (time === "0:00 pm") {
        return "12 noon";
      } else if (time.startsWith("0")) {
        time = `12${time.slice(1)}`;
      }
      return time.replace(" ", "");
    },
    baseUrl: function (project, cType) {
      return `${this.url}${project}/contentTypes/${cType}/entries?accessToken=${this.accessToken}&linkDepth=${this.linkDepth}&pageSize=500`;
    },
    callAxios: function (project, cType) {
      axios
        .get(this.baseUrl(project, cType))
        .then((response) => {
          if (cType === "banner") {
            this.item = response.data.items[0].bannerImage[0];
          } else {
            this.events = this.filterByLocation(
              this.createDates(response.data.items),
              "Bollin Valley"
            );
            if (this.events.length > 0) {
              this.events.sort(this.sortObjDate());
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.callAxios("website", "rangerEvents");
    this.callAxios("bollinValley", "banner");
  },
});
