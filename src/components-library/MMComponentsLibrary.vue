<script setup lang="ts">
//import all components from modules folder one by one
import Atoms from "./modules/Atoms.vue";
import ButtonsAndLinks from "./modules/Buttons.vue";
import Cards from "./modules/Cards.vue";
import FormElements from "./modules/FormElements.vue";
import Stepper from "./modules/Stepper.vue";
import Tabs from "./modules/Tabs.vue";
import Tables from "./modules/Tables.vue";
import DataIterator from "./modules/DataIterator.vue";
import Datepicker from "./modules/Datepicker.vue";
import Tree from "./modules/Tree.vue";
import Toasts from "./modules/Toasts.vue";
import Autocomplete from "./modules/Autocomplete.vue";
import PricingCard from "./modules/PricingCard.vue";
</script>

<template>
  <div class="mm-page mm-components-library">
    <h1 class="mm-page-title mm-page-title--h1">Components Library</h1>
    <div class="mm-flex mm-flex-align-start mm-mt-12">
      <div class="mm-components-library-sidebar mm-pa-6">
        <m-m-link class="mm-pa-4" href="/components-library#atoms"
          >Atoms</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#buttons"
          >Buttons</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#cards"
          >Cards</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#formelements"
          >Form Elements</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#stepper"
          >Stepper</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#tabs"
          >Tabs</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#tables"
          >Tables</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#dataiterator"
          >Data Iterator</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#datepicker"
          >Datepicker</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#tree"
          >Tree</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#toast"
          >Toast</m-m-link
        >
        <m-m-divider></m-m-divider>
        <m-m-link class="mm-pa-4" href="/components-library#inputautocomplete"
          >Input Autocomplete</m-m-link
        >
        <m-m-divider></m-m-divider>
      </div>
      <div class="mm-components-library-display mm-pa-6">
        <h2 id="datepicker" class="mm-page-subtitle--h1 mm-pa-4">Datepicker</h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <datepicker />
        </div>
        <h2 id="atoms" class="mm-page-title mm-page-title--h2 mm-pa-4">
          Atoms
        </h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <atoms></atoms>
        </div>

        <h2 id="buttons" class="mm-page-subtitle--h1 mm-pa-4">Buttons</h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <buttons-and-links></buttons-and-links>
        </div>

        <h2 id="cards" class="mm-page-subtitle--h1 mm-pa-4">Cards</h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <cards></cards>
        </div>

        <h2 id="formelements" class="mm-page-subtitle--h1 mm-pa-4">
          Form Elements
        </h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <form-elements></form-elements>
        </div>

        <h2 id="stepper" class="mm-page-subtitle--h1 mm-pa-4">Stepper</h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <stepper></stepper>
        </div>

        <h2 id="tabs" class="mm-page-subtitle--h1 mm-pa-4">Tabs</h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <tabs></tabs>
        </div>

        <h2 id="tables" class="mm-page-subtitle--h1 mm-pa-4">Tables</h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <tables></tables>
        </div>

        <h2 id="dataiterator" class="mm-page-subtitle--h1 mm-pa-4">
          Data Iterator
        </h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <data-iterator></data-iterator>
        </div>

        <h2 id="tree" class="mm-page-subtitle--h1 mm-pa-4">Tree</h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <tree></tree>
        </div>

        <h2 id="toast" class="mm-page-subtitle--h1 mm-pa-4">Toast</h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <toasts></toasts>
        </div>

        <h2 id="inputautocomplete" class="mm-page-subtitle--h1 mm-pa-4">
          Input Autocomplete
        </h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <Autocomplete></Autocomplete>
        </div>
        <h2 id="pricingCard" class="mm-page-subtitle--h1 mm-pa-4">
          Pricing Card
        </h2>
        <m-m-divider></m-m-divider>
        <div class="mm-px-12 mm-py-16">
          <PricingCard />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mm-components-library {
  &-sidebar {
    width: 250px;
    position: sticky;
    top: 0;
    left: 0;
  }
  &-display {
    flex: 1;
  }
}
</style>
