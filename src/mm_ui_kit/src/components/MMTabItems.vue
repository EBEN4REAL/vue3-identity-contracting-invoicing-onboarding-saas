<script lang="ts">
import { defineComponent, h } from "vue";

export default defineComponent({
  name: "MMTabItems",
  props: {
    currentTab: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots }) {
    return () => {
      return h(
        "div",
        {},
        slots.default
          ? slots.default().map((vnode) => {
              if (vnode.props && vnode.props["keep-alive"] !== undefined) {
                return h(
                  "div",
                  {
                    style: {
                      display:
                        props.currentTab === vnode.props["name"]
                          ? "block"
                          : "none",
                    },
                  },
                  vnode,
                );
              }

              return props.currentTab === vnode.props["name"]
                ? h("div", vnode)
                : null;
            })
          : null,
      );
    };
  },
});
</script>
