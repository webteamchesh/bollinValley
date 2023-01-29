var app = new Vue({
  el: "#vueApp",
  data() {
    let contentType = "Banner";
    let projectId = "bollinValley";
    return {
      accessToken: "QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I",
      linkDepth: 5, // leave at 5 if unsure.
      url: `https://cms-chesheast.cloud.contensis.com/api/delivery/projects/${projectId}/contentTypes/${contentType}/entries/`,
      item: undefined,
      col: "#FF7F50",
      contentType: contentType,
    };
  },
  methods: {
    getBaseUrl: function () {
      return `${this.url}?accessToken=${this.accessToken}&linkDepth=${this.linkDepth}&pageSize=10`;
    },
    callAxios: function (url) {
      axios
        .get(url)
        .then((response) => {
          this.item = response.data.items[0].bannerImage[0];
          console.log(this.item);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.callAxios(this.getBaseUrl());
  },
});
