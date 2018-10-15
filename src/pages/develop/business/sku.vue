<template>
  <q-page padding class="docs-btn row justify-center">
    <q-list no-border>
      <template v-for="(item,index) in properties">
        <q-item :key="index">
          <q-item-side style="min-width:100px">
            <q-item-tile>
              <q-chip color="primary">
                {{$t(item.Name)}}
              </q-chip>
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-checkbox v-for="value in item.values" :key="value.name" v-model="item.selectedValues" :val="value" :label="$t(value.Name)" style="min-width:150px" />
            <q-list no-border :v-show="item.Name!=$t('Place of delivery')&&item.selectedValues.length>0">
              <q-item>
                <q-item-main>
                  <span style="display:inline-block;min-width:100px">
                    <q-chip color="light">
                      {{$t(item.Name)}}
                    </q-chip>
                  </span>
                  <span style="display:inline-block;min-width:350px">
                    <q-chip color="light">
                      {{$t('Custom name')}}
                    </q-chip>
                  </span>
                  <span :v-if="item.Name=='Color'" style="display:inline-block;min-width:300px">
                    <q-chip color="light">
                      {{$t('Image')}}
                    </q-chip>
                  </span>
                </q-item-main>
              </q-item>
              <q-item v-for="selectedValue in item.selectedValues" :key="selectedValue.name">
                <q-item-main>
                  <span style="display:inline-block;min-width:100px">
                    {{$t(selectedValue.Name)}}
                  </span>
                  <span style="display:inline-block;min-width:350px">
                    <q-input v-model="selectedValue.DefinitionName" style="width:250px" color="primary" />
                  </span>
                  <span :v-if="item.Name=='Color'" style="display:inline-block;min-width:300px">
                    <q-uploader color="secondary" auto-expand url="url" />
                  </span>
                </q-item-main>
              </q-item>
            </q-list>
          </q-item-main>
        </q-item>
        <q-item-separator :key="'separator'+index"></q-item-separator>
      </template>
    </q-list>
    <div class="skus-container">
      <div class="row">
        <div class="col-12" style="text-align:left">{{$t('The retail price in the table below is the price of the product that is ultimately displayed to the buyer')}}.</div>
      </div>
      <div class="row gutter-sm">
        <div>{{$t('Set retail price in bulk')}}:</div>
        <div>
          <q-input style="width:100px" value=""/>
        </div>
        <div><q-btn push dense color="primary" :label="$t('Define')"/></div>
        <div>{{$t('Set inventory in batches')}}:</div>
        <div>
          <q-input style="width:100px" value=""/>
        </div>
        <div><q-btn push dense color="primary" :label="$t('Define')"/></div>
      </div>
      <div class="row bg-primary text-white" style="height:40px;line-height:40px">
        <div class="col q-pl-md" v-for="item in properties" v-if="item.selectedValues.length>0" :key="item.Name">{{$t(item.Name)}}</div>
        <div class="col q-pl-md">
          <span class="c_red">*</span>{{$t('Retail price')}}</div>
        <div class="col">
          <span class="c_red">*</span>{{$t('In stock')}}</div>
        <div class="col">{{$t('Commodity code')}}</div>
      </div>
      <div class="row" v-for="(sku,index) in skus" :key="index">
        <div class="col q-pl-md" v-for="item in properties" v-if="item.selectedValues.length>0" :key="item.Id">{{getValueName(sku,item)}}</div>
        <div class="col q-pl-md"><q-input style="width:100px" type="text" v-model="sku.SkuPrice" maxlength="9" /></div>
        <div class="col"><q-input style="width:100px" type="text" v-model="sku.StockQuantity" maxlength="9" /></div>
        <div class="col"><q-input style="width:100px" type="text" v-model="sku.SkuCode" maxlength="20" /></div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "sku",
  data() {
    return {
      properties: [
        {
          Id: 10,
          Name: "Material",
          values: [
            {
              PropertyId: 10,
              Id: 351785,
              Name: "ABS",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 477,
              Name: "Aluminum",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 529,
              Name: "Canvas",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 365211,
              Name: "Cotton",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 365212,
              Name: "Twill fabric",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 395,
              Name: "EVA",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 396,
              Name: "Leather",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 365213,
              Name: "Microfiber",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 1064,
              Name: "Synthetic rubber",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 63,
              Name: "Nylon",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 437,
              Name: "PE",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 124,
              Name: "Plastic",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 48,
              Name: "Polyester",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 438,
              Name: "PP",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 452,
              Name: "PU",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 439,
              Name: "PVC",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 1170,
              Name: "Silica gel",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 352621,
              Name: "Vinyl",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 1042,
              Name: "Genuine leather",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 1179,
              Name: "TPU",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 4,
              Name: "Other",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 501,
              Name: "PC",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 10,
              Id: 201662808,
              Name: "PC + TPU",
              DefinitionName: "",
              ImageUrl: ""
            }
          ],
          selectedValues: []
        },
        {
          Id: 14,
          Name: "Color",
          values: [
            {
              PropertyId: 14,
              Id: 771,
              Name: "Beige",
              DefinitionName: "Transparent",
              ImageUrl:
                "https://g04.a.alicdn.com/kf/HTB1B0TWOVXXXXalXVXXq6xXFXXXn.jpg"
            },
            {
              PropertyId: 14,
              Id: 193,
              Name: "Black",
              DefinitionName: "Mixture",
              ImageUrl:
                "https://g01.a.alicdn.com/kf/HTB13ZPMOVXXXXa2aXXXq6xXFXXXU.jpg"
            },
            {
              PropertyId: 14,
              Id: 173,
              Name: "Blue",
              DefinitionName: "Random",
              ImageUrl:
                "https://g02.a.alicdn.com/kf/HTB1pC_COVXXXXakapXXq6xXFXXXU.jpg"
            },
            {
              PropertyId: 14,
              Id: 1254,
              Name: "Sky blue",
              DefinitionName: "Brown",
              ImageUrl:
                "https://g03.a.alicdn.com/kf/HTB1wj3lOVXXXXaxXXXXq6xXFXXX9.jpg"
            },
            {
              PropertyId: 14,
              Id: 365458,
              Name: "Brown",
              DefinitionName: "Purple",
              ImageUrl:
                "https://g01.a.alicdn.com/kf/HTB1SPcjOVXXXXcrXXXXq6xXFXXX5.jpg"
            },
            {
              PropertyId: 14,
              Id: 100018786,
              Name: "Transparent",
              DefinitionName: "Blue",
              ImageUrl:
                "https://g01.a.alicdn.com/kf/HTB1L9vDOVXXXXXAapXXq6xXFXXXY.jpg"
            },
            {
              PropertyId: 14,
              Id: 350850,
              Name: "Gold",
              DefinitionName: "Cyan",
              ImageUrl:
                "https://g02.a.alicdn.com/kf/HTB1TCcjOVXXXXaUXXXXq6xXFXXX8.jpg"
            },
            {
              PropertyId: 14,
              Id: 691,
              Name: "Gray",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 200004890,
              Name: "Dark gray",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 175,
              Name: "Green",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 200004889,
              Name: "ArmyGreen",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 200002130,
              Name: "Ivory white",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 200001438,
              Name: "Khaki",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 200003699,
              Name: "Multicolor",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 350852,
              Name: "Orange",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 1052,
              Name: "Pink",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 496,
              Name: "Purple",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 200004891,
              Name: "Violet",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 10,
              Name: "Red",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 350853,
              Name: "Silver",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 29,
              Name: "White",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 366,
              Name: "Yellow",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 201447303,
              Name: "Rose",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 201447325,
              Name: "Crimson",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 201447326,
              Name: "Dark blue",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 14,
              Id: 202007806,
              Name: "Matte Black",
              DefinitionName: "",
              ImageUrl: ""
            }
          ],
          selectedValues: []
        },
        {
          Id: 200007763,
          Name: "Place of delivery",
          values: [
            {
              PropertyId: 200007763,
              Id: 201336100,
              Name: "CN",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336106,
              Name: "US",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336105,
              Name: "UK",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336101,
              Name: "DE",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336104,
              Name: "ES",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336099,
              Name: "AU",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336103,
              Name: "RU",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336102,
              Name: "ID",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336342,
              Name: "FR",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200007763,
              Id: 201336343,
              Name: "IT",
              DefinitionName: "",
              ImageUrl: ""
            }
          ],
          selectedValues: []
        },
        {
          Id: 200000828,
          Name: "Package",
          values: [
            {
              PropertyId: 200000828,
              Id: 201655809,
              Name: "Shell + film",
              DefinitionName: "",
              ImageUrl: ""
            },
            {
              PropertyId: 200000828,
              Id: 201655810,
              Name: "Shell + lanyard",
              DefinitionName: "",
              ImageUrl: ""
            }
          ],
          selectedValues: []
        }
      ],
      checkedProperties: [
      ],
      skus: [
      ]
    };
  },
  computed: {
    allCheckedLength: function() {
      var length = 0;
      for (let item of this.properties) {
        length += item.selectedValues.length;
      }
      return length;
    },
    skusResult: function() {
      return JSON.stringify(this.skus);
    },
    propertyResult: function() {
      var result = [];
      for (let item of this.properties) {
        for (let selected of item.selectedValues) {
          result.push(selected);
        }
      }
      return JSON.stringify(result);
    }
  },
  watch: {
    allCheckedLength: {
      handler: "reBuild"
    }
  },
  methods: {
    reBuild: function(val, oldVal) {
      var vm = this;
      var vmSkus = (this.skus = []);
      var propertyChecked = [];
      var skuCount = 1;
      var ori = [];
      for (let item of vm.properties) {
        var selectValues = item.selectedValues;
        if (selectValues.length > 0) {
          propertyChecked.push(vm.properties.indexOf(item));
          skuCount *= selectValues.length;
          ori.push(selectValues);
        }
      }

      /*$.each(propertyChecked,
                        function () {
                            ori.push(vm.properties[this].selectedValues);
                        });*/
      //console.log(JSON.stringify(ori));
      var ret = this.descartes(ori);
      //console.log(JSON.stringify(ret));
      for (var i = 0; i < ret.length; i++) {
        var sku = { SkuCode: "", SkuPrice: "", StockQuantity: "" };
        sku.values = [];
        for (let item of ret[i]) {
          sku.values.push({ propertyId: item.PropertyId, valueId: item.Id });
        }
        vmSkus.push(sku);
      }
    },
    getValueName: function(sku, property) {
      var valueName = "";
      for (let item of sku.values) {
        var _this = this;
        if (item.propertyId == property.Id) {
          for (let s of property.selectedValues) {
            if (item.valueId == s.Id) {
              valueName = s.Name;
              return valueName;
            }
          }
        }
      }
      return valueName;
    },
    descartes: function(list) {
      //parent上一级索引;count指针计数
      var point = {};
      var result = [];
      var pIndex = null;
      var tempCount = 0;
      var temp = [];
      //根据参数列生成指针对象
      for (var index in list) {
        if (typeof list[index] == "object") {
          point[index] = { parent: pIndex, count: 0 };
          pIndex = index;
        }
      }
      //单维度数据结构直接返回
      if (pIndex == null) {
        return list;
      }
      //动态生成笛卡尔积
      while (true) {
        for (var index in list) {
          tempCount = point[index]["count"];
          temp.push(list[index][tempCount]);
        }
        //压入结果数组
        result.push(temp);
        temp = [];
        //检查指针最大值问题
        while (true) {
          if (point[index]["count"] + 1 >= list[index].length) {
            point[index]["count"] = 0;
            pIndex = point[index]["parent"];
            if (pIndex == null) {
              return result;
            }
            //赋值parent进行再次检查
            index = pIndex;
          } else {
            point[index]["count"]++;
            break;
          }
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.skus-container {
  width: 100%;

  .row + .row {
    margin-top: 1rem;
  }
}

table {
  border-collapse: collapse;
}

table th {
  background-color: antiquewhite;
}

table td, th {
  border: solid 1px #b4aba1;
}

.table label {
  margin-left: 30px;
  float: left;
  width: 150px;
}

.table label input {
  margin-top: 4px;
}

.table td {
  min-width: 100px;
}

.list_table {
  clear: both;
  margin-left: 30px;
  margin-top: 10px;
}
</style>
