/* !!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import NodeDriver from 'shared/mixins/node-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
const LANGUAGE;
/* !!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/* !!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed     = Ember.computed;
const observer     = Ember.observer;
const get          = Ember.get;
const set          = Ember.set;
const setProperties= Ember.setProperties;
const alias        = Ember.computed.alias;
const service      = Ember.inject.service;
const EmberPromise = Ember.RSVP.Promise;
const all          = Ember.RSVP.all;
const next         = Ember.run.next;
/* !!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const languages = LANGUAGE;
const PAGE_SIZE = 50;
const DEFAULT_IMAGE = 'ubuntu_16_04_64';
const DISKS = [
  {
    label: 'nodeDriver.aliyunecs.disk.cloud',
    value: 'cloud'
  },
  {
    label: 'nodeDriver.aliyunecs.disk.ephemeralSsd',
    value: 'ephemeral_ssd'
  },
  {
    label: 'nodeDriver.aliyunecs.disk.ssd',
    value: 'cloud_ssd'
  },
  {
    label: 'nodeDriver.aliyunecs.disk.efficiency',
    value: 'cloud_efficiency'
  },
  {
    label: 'nodeDriver.aliyunecs.disk.essd',
    value: 'cloud_essd'
  },
  {
    label: 'nodeDriver.aliyunecs.disk.auto',
    value: 'cloud_auto'
  },
];
const PERIDO_WEEK = ['1'];
const PERIOD_MONTH = ['1', '2', '3', '6', '12', '24', '36', '48', '60'];
const OPT_CHARGETYPES = [
  {
    label: 'nodeDriver.aliyunecs.internetChargeTypes.payByTraffic',
    value: 'PayByTraffic'
  },
  {
    label: 'nodeDriver.aliyunecs.internetChargeTypes.payByBandwidth',
    value: 'PayByBandwidth'
  },
];

const DEFAULT_INSTANCE_TYPE = 'ecs.g5.large';

// v2.6.5 => https://www.suse.com/zh-cn/suse-rancher/support-matrix/all-supported-versions/rancher-v2-6-5/
const IMAGE_VERSIONS = [
  {
    type:    'CentOS',
    version: '7.7, 7.8, 7.9',
  },
  {
    type:    'Oracle Linux',
    version: '7.7, 7.9, 8.2, 8.3, 8.4',
  },
  {
    type:    'RHEL',
    version: '7.7, 7.8, 7.9, 8.2, 8.3, 8.4, 8.5',
  },
  {
    type:    'Ubuntu',
    version: '18.04, 20.04',
  },
  {
    type:    'Rocky Linux',
    version: '8.4',
  },
  {
    type:    'openSUSE',
    version: '15.3',
  },
  {
    type:    'SLES',
    version: '12 SP5,  15 SP1, 15 SP2, 15 SP3',
  },
]

const OPEN_PORT = ['6443/tcp', '2379/tcp', '2380/tcp', '8472/udp', '4789/udp', '9796/tcp', '10256/tcp', '10250/tcp', '10251/tcp', '10252/tcp'];

/* !!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(NodeDriver, {
  driverName:     '%%DRIVERNAME%%',
  config:     alias('model.%%DRIVERNAME%%Config'),
  app:        service(),
  router:     service(),
  session:    service(),

  configField:    'aliyunecsConfig',
  zones:          null,
  regions:        null,
  securityGroups: [],
  images:         null,
  instanceTypes:  null,

  allInstanceTypes:     null,
  resourceGroups:       null,
  resourceGroupChoices: null,
  instanceChargeType:   'PostPaid',
  periodUnit:           '6_Month',

  systemDiskChoices: [],
  dataDiskChoices:   [],
  imageVersions:     IMAGE_VERSIONS,


  cloudCredentialDriverName: 'aliyun',

  step: 1,

  lanChanged:    null,
  refresh:       false,

  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template      = Ember.HTMLBars.compile(decodedLayout, { moduleName: 'nodes/components/driver-%%DRIVERNAME%%/template' });

    set(this, 'layout', template);

    this._super(...arguments);

    const lang = get(this, 'session.language');

    get(this, 'intl.locale');
    this.loadLanguage(lang);
    let config      = get(this, 'config');
    let configField = get(this, 'configField');

    if ( !config ) {
      config = this.get('globalStore').createRecord({
        type:                 configField,
        accessKeySecret:      '',
        instanceType:         DEFAULT_INSTANCE_TYPE,
        internetChargeType:   'PayByTraffic',
        systemDiskSize:       '40',
        diskSize:             '0',
        resourceGroupId:      '',
        instanceChargeType:   '',
        spotDuration:         '1',
        spotStrategy:         'SpotAsPriceGo',
      });

      set(this, 'model.engineInstallURL', 'https://rancher2-drivers.oss-cn-beijing.aliyuncs.com/pandaria/docker-install/19.03-aliyun.sh');
      set(this, 'model.engineStorageDriver', 'overlay2');
      set(this, 'model.%%DRIVERNAME%%Config', config);
    } else {
      this.initInstanceChargeType();
    }

    set(this, 'openPorts', this.initOpenPorts(get(this, 'config.openPort') || OPEN_PORT));
    this.openPortsDidChange();
  },
  /* !!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

  actions: {
    async alyLogin(cb) {
      setProperties(this, { 'errors': null, });

      const errors = [];
      const intl = get(this, 'intl');

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb && cb();

        return;
      }

      try {
        await all([this.fetchResourceGroups(), this.fetchRegions()]);
        this.regionDidChange();
        set(this, 'step', 2);
        cb && cb();
      } catch (e) {
        errors.push(get(e, 'body.Message') || e);
        set(this, 'errors', errors);
        cb && cb();

        return;
      }
    },

    finishAndSelectCloudCredential(cred) {
      if (cred) {
        set(this, 'primaryResource.cloudCredentialId', get(cred, 'id'));

        this.send('alyLogin');
      }
    },

    loadStorageTypes(cb) {
      set(this, 'errors', null);

      const errors = get(this, 'errors') || [];
      const intl = get(this, 'intl');
      const imageId = get(this, 'config.imageId');
      const openPorts = get(this, 'config.openPort');
      const openPortReg = /^[0-9]+(\/(tcp|udp|all|icmp|gre))?$/;

      if(openPorts && openPorts.length){
        if(openPorts.find(item=>!openPortReg.test(item))){
          errors.push(intl.t('nodeDriver.aliyunecs.openPort.error', {match: openPortReg}));
        }
      }

      if ( !imageId ) {
        errors.push(intl.t('nodeDriver.aliyunecs.errors.imageIdRequired'));
      }

      const spotStrategy = get(this, 'config.spotStrategy');
      const spotPriceLimit = get(this, 'config.spotPriceLimit');

      if (spotStrategy === 'SpotWithPriceLimit' && !spotPriceLimit){
        set(this, 'config.spotPriceLimit', '0');
      }

      if ( errors.length > 0 ) {
        set(this, 'errors', errors);
        cb && cb();

        return;
      }

      set(this, 'step', 4);
      cb && cb();
    },

    loadInstanceTypes(cb) {
      set(this, 'errors', null);

      const errors = get(this, 'errors') || [];
      const intl = get(this, 'intl');

      const zone = get(this, 'config.zone');
      const vpcId = get(this, 'config.vpcId');
      const vswitchId = get(this, 'config.vswitchId')

      if ( zone ) {
        if ( !vpcId ) {
          errors.push(intl.t('nodeDriver.aliyunecs.errors.vpcIdRequired'));
        }
        if ( !vswitchId ) {
          errors.push(intl.t('nodeDriver.aliyunecs.errors.vswitchIdRequired'));
        }
      } else {
        errors.push(intl.t('nodeDriver.aliyunecs.errors.zoneIdRequired'));
      }

      if ( errors.length > 0 ) {
        set(this, 'errors', errors);
        cb && cb();

        return;
      }

      if (!get(this, 'config.securityGroup')) {
        set(this, 'config.securityGroup', 'docker-machine')
      }

      this.fetch('InstanceType', 'InstanceTypes', { regionId: get(this, 'config.region') })
        .then((instanceTypes) => {
          set(this, 'allInstanceTypes', instanceTypes);
          this.fetchAvailableInstanceTypes().then((availableResources) => {
            set(this, 'instanceTypes', instanceTypes.filter((instanceType) => availableResources.indexOf(instanceType.value) > -1).map((instanceType) => {
              return {
                group: instanceType.raw.InstanceTypeFamily,
                value: instanceType.value,
                label: `${ instanceType.raw.InstanceTypeId } ( ${ instanceType.raw.CpuCoreCount } ${ instanceType.raw.CpuCoreCount > 1 ? 'Cores' : 'Core' } ${ instanceType.raw.MemorySize }GB RAM )`,
              }
            }));

            let instanceType;

            if ( (get(this, 'instanceTypes').findBy('value', get(this, 'config.instanceType'))) ) {
              instanceType = get(this, 'config.instanceType');
            } else {
              instanceType = get(this, 'instanceTypes.firstObject.value');
            }

            set(this, 'config.instanceType', instanceType);

            this.loadImages(cb);
            this.fetchAvailableSystemDisks();
            this.fetchAvailabelDataDisks();
          });
        })
        .catch((err) => {
          const errors = get(this, 'errors') || [];

          errors.pushObject(err.message || err);
          set(this, 'errors', errors);
          cb && cb();

          return;
        });
    },

    instanceChargeTypeChange(){
      let instanceChargeType = get(this, 'instanceChargeType');

      if (instanceChargeType === 'SpotStrategy') {
        instanceChargeType = 'PostPaid'
        set(this, 'config.spotDuration', '1');
        set(this, 'config.spotStrategy', 'SpotAsPriceGo');
      } else {
        set(this, 'config.spotStrategy', 'NoSpot');
        delete this.config.spotDuration;
        delete this.config.spotPriceLimit;
      }
      if (instanceChargeType === 'PostPaid') {
        delete this.config.period;
        delete this.config.periodUnit;
      }

      if (instanceChargeType === 'PrePaid'){
        set(this, 'config.spotStrategy', '');
        set(this, 'config.spotDuration', '0');
      }

      set(this, 'config.instanceChargeType', instanceChargeType);

      this.getAvailableInstanceTypes();
    },

    periodUnitChange(){
      const val = get(this, 'periodUnit');

      if (val) {
        const ary = val.split('_');

        if (ary[1]) {
          set(this, 'config.period', ary[0]);
          set(this, 'config.periodUnit', ary[1]);
        }
      } else {
        delete this.config.period;
        delete this.config.periodUnit;
      }
    },

    spotPriceLimitChange(){
      const val = get(this, 'config.spotPriceLimit');
      const newVal = Number(val).toFixed(3);

      if (val !== newVal){
        set(this, 'config.spotPriceLimit', newVal.toString())
      }
    },
  },

  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    const intl = get(this, 'intl');
    var errors = get(this, 'errors')||[];
    if ( !get(this, 'model.name') ) {
      errors.push(intl.t('nodeDriver.aliyunecs.errors.nameRequired'));
    }

    // Add more specific errors

    // Check something and add an error entry if it fails:
    const name = get(this, 'model.name');

    const sshPassword = get(this, 'config.sshPassword');

    const lower = /[a-z]/.test(sshPassword) ? 1 : 0;
    const upper = /[A-Z]/.test(sshPassword) ? 1 : 0;
    const number = /[0-9]/.test(sshPassword) ? 1 : 0;
    const special = /[?+*$^().|<>';:\-=\[\]\{\},&%#@!~`\\]/.test(sshPassword) ? 1 : 0;

    if (sshPassword && (sshPassword.length < 8) || sshPassword.length > 30) {
      errors.push(intl.t('nodeDriver.aliyunecs.errors.sshPasswordLengthNotValid'));
    }

    if (sshPassword && !/[?+*$^().|<>';:\-=\[\]\{\},&%#@!~`\\a-zA-Z0-9]+/.test(sshPassword)) {
      errors.push(intl.t('nodeDriver.aliyunecs.errors.sshPasswordInvalidCharacter'));
    }

    if (sshPassword && (lower + upper + number + special < 3)) {
      errors.push(get(this, 'intl').t('nodeDriver.aliyunecs.errors.sshPasswordFormatError'));
    }

    // Set the array of errors for display,
    // and return true if saving should continue.
    if ( get(errors, 'length') ) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  // Any computed properties or custom logic can go here
  languageDidChanged: observer('intl.locale', function() {
    const lang = get(this, 'intl.locale');

    if (lang) {
      this.loadLanguage(lang[0]);
    }
  }),

  resourceGroupChoicesShouldChange: observer('intl.locale', 'resourceGroups', function() {
    const intl    = get(this, 'intl');
    let choices = get(this, 'resourceGroups').concat();

    next(() => {
      choices = choices.filter((item) => item.raw.Status === 'OK')

      choices.unshift({
        label: intl.t('nodeDriver.aliyunecs.resourceGroup.all'),
        value: ''
      });

      set(this, 'resourceGroupChoices', choices);
    })
  }),

  resourceGroupIdDidChange: observer('config.resourceGroupId', function() {
    this.regionDidChange();
  }),

  zoneDidChange: observer('config.zone', function() {
    const intl = get(this, 'intl');
    const resourceGroupId = get(this, 'config.resourceGroupId');
    const externalParams = {
      regionId: get(this, 'config.region'),
      vpcId:    get(this, 'config.vpcId')
    };

    if (!!resourceGroupId && resourceGroupId !== '') {
      externalParams.resourceGroupId = resourceGroupId;
    }

    if ( get(this, 'config.vpcId') && !get(this, 'vswitches') ) {
      this.fetch('VSwitch', 'VSwitches', externalParams).then((vswitches) => {
        set(this, 'vswitches', vswitches.map((vswitch) => {
          let label = `${ vswitch.raw.VSwitchName } (${ vswitch.value })`

          if (vswitch.raw.IsDefault) {
            label = `${ intl.t('nodeDriver.aliyunecs.vswitchId.default') } (${ vswitch.value })`
          }

          return {
            ...vswitch,
            label
          };
        }));
        this.resetVswitch();
      });
    } else {
      this.resetVswitch();
    }
  }),

  vpcDidChange: observer('config.vpcId', function() {
    const intl = get(this, 'intl');
    const vpcId = get(this, 'config.vpcId');
    const resourceGroupId = get(this, 'config.resourceGroupId');
    const externalParams = {
      regionId: get(this, 'config.region'),
      vpcId
    };

    if (!!resourceGroupId && resourceGroupId !== '') {
      externalParams.ResourceGroupId = resourceGroupId;
    }

    if (vpcId) {
      this.fetch('VSwitch', 'VSwitches', externalParams).then((vswitches) => {
        set(this, 'vswitches', vswitches.map((vswitch) => {
          let label = `${ vswitch.raw.VSwitchName } (${ vswitch.value })`

          if (vswitch.raw.IsDefault) {
            label = `${ intl.t('nodeDriver.aliyunecs.vswitchId.default') } (${ vswitch.value })`
          }

          return {
            ...vswitch,
            label
          };
        }));
        const selectedVSwitch = get(this, 'config.vswitchId');

        if (selectedVSwitch) {
          const found = vswitches.findBy('value', selectedVSwitch);

          if (!found) {
            set(this, 'config.vswitchId', null);
          }
        }
      });

      const securityGroupsPromise = this.fetch('SecurityGroup', 'SecurityGroups', externalParams);

      if (securityGroupsPromise === undefined) {
        return;
      }

      securityGroupsPromise.then((securityGroups) => {
        const out = [];

        securityGroups.forEach((obj) => {
          const label = `${ obj.raw.SecurityGroupName } (${ obj.value })`;

          out.push({
            ...obj,
            value: obj.raw.SecurityGroupName,
            label
          })
        });

        set(this, 'securityGroups', out);

        const selectedSecurityGroup = get(this, 'config.securityGroup');
      });
    } else {
      set(this, 'config.vswitchId', null);
      set(this, 'vswitches', []);
      set(this, 'securityGroups', []);
      set(this, 'config.securityGroup', 'docker-machine');
    }
  }),

  regionsShouldChange: observer('intl.locale', async function() {
    await this.fetchRegions();
  }),

  regionDidChange: observer('config.region', function() {
    const intl = get(this, 'intl');
    const region = get(this, 'config.region');
    const resourceGroupId = get(this, 'config.resourceGroupId');
    const externalParams = { regionId: region, };

    if (!!resourceGroupId && resourceGroupId !== '') {
      externalParams.ResourceGroupId = resourceGroupId;
    }

    if (region) {
      this.fetch('Vpc', 'Vpcs', externalParams).then((vpcs) => {
        set(this, 'vpcs', vpcs.map((vpc) => {
          let label = `${ vpc.raw.VpcName } (${ vpc.value })`

          if (vpc.raw.IsDefault) {
            label = `${ intl.t('nodeDriver.aliyunecs.vpcId.default') } (${ vpc.value })`
          }

          return {
            ...vpc,
            label
          };
        }));

        const selectedVPC = get(this, 'config.vpcId');

        if (selectedVPC) {
          const found = vpcs.findBy('value', selectedVPC);

          if (!found) {
            set(this, 'config.vpcId', null);
          } else {
            this.vpcDidChange();
          }
        }
      });

      this.fetch('Zone', 'Zones', { regionId: get(this, 'config.region') }).then((zones) => {
        set(this, 'zones', zones);
        const selectedZone = get(this, 'config.zone');

        if (selectedZone) {
          const found = zones.findBy('value', selectedZone);

          if (!found) {
            set(this, 'config.zone', null);
          } else {
            this.zoneDidChange();
          }
        }
      });
    }
  }),

  bandwidthShouldChange: observer('config.privateAddressOnly', function() {
    const _private = get(this, 'config.privateAddressOnly');
    const _config = get(this, 'config');

    if (_private) {
      delete _config.internetMaxBandwidth;
      set(this, 'config', _config)
    } else {
      set(this, 'config.internetMaxBandwidth', '1');
    }
  }),

  systemDiskChoicesDidChange: observer('systemDiskChoices.@each.value', function() {
    const systemDiskCategory = get(this, 'config.systemDiskCategory');
    const found              = get(this, 'systemDiskChoices').findBy('value', systemDiskCategory);

    if ( !found ) {
      set(this, 'config.systemDiskCategory', get(this, 'systemDiskChoices.firstObject.value'));
    }
  }),

  dataDiskChoicesDidChange: observer('dataDiskChoices.@each.value', function() {
    const diskCategory = get(this, 'config.diskCategory');
    const found        = get(this, 'dataDiskChoices').findBy('value', diskCategory);

    if ( !found ) {
      set(this, 'config.diskCategory', get(this, 'dataDiskChoices.firstObject.value'));
    }
  }),

  instanceTypeDidChange: observer('config.instanceType', function() {
    this.loadImages();
    this.fetchAvailableSystemDisks();
    this.fetchAvailabelDataDisks();
  }),

  systemDiskDidChange: observer('config.systemDiskCategory', function() {
    this.fetchAvailabelDataDisks();
    if (get(this, 'config.systemDiskCategory') === 'cloud_auto' && get(this, 'config.systemDiskSize') < 40){
      set(this, 'config.systemDiskSize', '40');
    }
  }),

  diskCategoryDidChange: observer('config.diskCategory', function() {
    if ( !get(this, 'config.diskSize') ||  get(this, 'config.diskSize') === '0'){
      return;
    }
    if (get(this, 'config.diskCategory') === 'cloud_auto' && get(this, 'config.diskSize') < 40){
      set(this, 'config.diskSize', '40');
    }
  }),

  openPortsDidChange: observer('openPorts', function() {
    let str = (get(this, 'openPorts') || '').trim();
    let ary = [];

    if (str.length) {
      ary = str.split(/\s*,\s*/);
    }

    set(this, 'config.openPort', ary);
  }),

  systemDiskMin: computed('config.systemDiskCategory', function() {
    const isAutoPLDisk = get(this, 'config.systemDiskCategory') === 'cloud_auto';

    return isAutoPLDisk ? 40 : 20;
  }),
  dataDiskMin: computed('config.diskCategory', function() {
    const isAutoPLDisk = get(this, 'config.diskCategory') === 'cloud_auto';

    return isAutoPLDisk ? 40 : 20;
  }),

  watchSpotStrategy: observer('config.spotStrategy', function() {
    const spotStrategy = get(this, 'config.spotStrategy');

    if ( spotStrategy === 'SpotAsPriceGo' ) {
      delete this.config.spotPriceLimit;
    }
  }),

  internetChargeTypes: computed('intl.locale', function() {
    const intl = get(this, 'intl');

    return OPT_CHARGETYPES.map((item) => ({
      ...item,
      label: intl.t(item.label),
    }));
  }),

  instanceChargeTypeOptions: computed('intl.locale', function() {
    const options = ['prePaid', 'postPaid', 'spotStrategy'];
    const intl = get(this, 'intl');

    return options.map((o) => {
      return {
        label: intl.t(`nodeDriver.aliyunecs.instanceChargeType.${ o }`),
        value: this.upperFirst(o),
      };
    });
  }),

  periodUnitOptions: computed('intl.locale', function() {
    const intl = get(this, 'intl');
    const out = [];

    PERIDO_WEEK.forEach((item) => {
      out.push({
        label: `${ item }${ intl.t('nodeDriver.aliyunecs.periodUnit.week') }`,
        value: `${ item }_Week`
      });
    });
    PERIOD_MONTH.forEach((item) => {
      const month = Number(item);
      let label = '';

      if (month === 6) {
        label = `${ intl.t('nodeDriver.aliyunecs.periodUnit.half') } ${ intl.t('nodeDriver.aliyunecs.periodUnit.year') }`;
      } else if (month % 12 === 0) {
        const year = month / 12;

        label = `${ year } ${ intl.t('nodeDriver.aliyunecs.periodUnit.year') }`;
      } else {
        label = `${ item } ${ intl.t('nodeDriver.aliyunecs.periodUnit.month') }`;
      }
      out.push({
        label,
        value: `${ item }_Month`
      });
    });

    return out;
  }),

  filteredVSwitches: computed('vswitches.[]', 'config.zone', function() {
    const zone = get(this, 'config.zone');

    return (get(this, 'vswitches') || []).filter((swith) => {
      if ( zone && zone !== swith.raw.ZoneId) {
        return false;
      }

      return true;
    });
  }),

  regionShowValue: computed('intl.locale', 'config.region', 'regions.[]', function() {
    const regionId = get(this, 'config.region');
    const regions = get(this, 'regions') || [];

    if (regionId && regions.length > 0) {
      return get(regions.findBy('value', regionId), 'label')
    } else {
      return ''
    }
  }),

  instanceChargeTypeShowValue: computed('intl.locale', 'config.instanceChargeType', function() {
    const instanceChargeType = get(this, 'instanceChargeType');
    const instanceChargeTypeOptions = get(this, 'instanceChargeTypeOptions') || [];

    return instanceChargeType ? get(instanceChargeTypeOptions.findBy('value', instanceChargeType), 'label') : '';
  }),
  periodUnitShowValue: computed('intl.locale', 'config.period', 'config.periodUnit', function() {
    const periodUnit = get(this, 'periodUnit');
    const periodUnitOptions = get(this, 'periodUnitOptions') || [];

    return periodUnit ? get(periodUnitOptions.findBy('value', periodUnit), 'label') : '';
  }),

  zoneShowValue: computed('intl.locale', 'config.zone', 'zones.[]', function() {
    const zoneId = get(this, 'config.zone');
    const zones = get(this, 'zones') || [];

    if (zoneId && zones.length > 0) {
      return get(zones.findBy('value', zoneId), 'raw.LocalName')
    } else {
      return ''
    }
  }),

  vpcShowValue: computed('intl.locale', 'config.vpcId', 'vpcs.[]', function() {
    const vpcs = get(this, 'vpcs');

    if (vpcs && get(this, 'config.vpcId')) {
      return get(vpcs.findBy('value', get(this, 'config.vpcId')), 'label');
    } else {
      return '';
    }
  }),

  vswitchShowValue: computed('intl.locale', 'config.vswitchId', 'vswitches.[]', function() {
    const vswitches = get(this, 'vswitches');

    if (vswitches && get(this, 'config.vswitchId')) {
      return get(vswitches.findBy('value', get(this, 'config.vswitchId')), 'label');
    } else {
      return '';
    }
  }),

  securityGroupShowValue: computed('intl.locale', 'config.securityGroup', 'securityGroups.[]', function() {
    const securityGroups = get(this, 'securityGroups');
    const securityGroup = get(this, 'config.securityGroup');

    if(!securityGroup){
      set(this, 'config.securityGroup', 'docker-machine');
    }

    if (securityGroup === 'docker-machine') {
      return securityGroup
    }

    if (securityGroups && securityGroups.length > 0 && securityGroup) {
      const current = securityGroups.findBy('value', securityGroup);

      if(current){
        return get(current, 'label');
      } else {
        return securityGroup
      }
    } else {
      return '';
    }
  }),

  resourceGroupShowValue: computed('intl.locale', 'config.resourceGroupId', 'resourceGroupChoices.[]', function() {
    const resourceGroupChoices = get(this, 'resourceGroupChoices');

    if (resourceGroupChoices && get(this, 'config.resourceGroupId') !== null) {
      return get(resourceGroupChoices.findBy('value', get(this, 'config.resourceGroupId')), 'label');
    } else {
      return '';
    }
  }),

  internetChargeShowValue: computed('intl.locale', 'config.internetChargeType', 'internetChargeTypes.[]', function() {
    const internetChargeType = get(this, 'config.internetChargeType');
    const internetChargeTypes = get(this, 'internetChargeTypes');

    if (internetChargeType) {
      return get(internetChargeTypes.findBy('value', internetChargeType), 'label');
    } else {
      return '';
    }
  }),

  cloudCredentialChoices: computed('cloudCredentials', function() {
    return this.cloudCredentials.filter((cc) => get(cc, 'aliyunecscredentialConfig'));
  }),

  selectedCloudCredential: computed('primaryResource.cloudCredentialId', 'cloudCredentials.length', function() {
    return get(this, 'cloudCredentials').findBy('id', get(this, 'primaryResource.cloudCredentialId'))
  }),

  resetVswitch() {
    const switches = get(this, 'filteredVSwitches');
    const selectedVSwitch = get(this, 'config.vswitchId');

    if (selectedVSwitch) {
      const found = switches.findBy('value', selectedVSwitch);

      if ( !found ) {
        set(this, 'config.vswitchId', null);
      }
    }
  },

  async fetchResourceGroups() {
    const groups = await this.fetch('ResourceGroup', 'ResourceGroups');

    set(this, 'resourceGroups', groups.map((group) => {
      return {
        label: `${ group.raw.DisplayName } (${ group.raw.Id })`,
        value: group.raw.Id,
        raw:   group.raw
      };
    }));
  },

  async fetchRegions(cb) {
    let AcceptLanguage = 'zh-CN';

    if (get(this, 'intl.locale')[0] === 'en-us') {
      AcceptLanguage = 'en-US';
    }

    const regions = await this.fetch('Region', 'Regions', { AcceptLanguage });

    set(this, 'regions', regions.map((region) => {
      return {
        value: region.raw.RegionId,
        label: region.raw.LocalName,
      };
    }));
  },

  fetchAvailableInstanceTypes() {
    const region  = get(this, 'config.region');
    const zone    = get(this, 'config.zone')
    let results = [];
    const params  = {
      regionId:           region,
      systemDiskCategory: get(this, 'config.systemDiskCategory'),
      dataDiskCategory:   get(this, 'config.diskCategory'),
      destinationResource: 'InstanceType',
    };

    if ( get(this, 'config.zone') ) {
      params['zoneId'] = zone;
    }
    if ( get(this, 'config.instanceChargeType') ) {
      params['instanceChargeType'] = get(this, 'config.instanceChargeType');
    }

    return new EmberPromise((resolve, reject) => {
      this.fetch('', 'AvailableResource', params).then((res) => {
        results = this.getAvailableResources(res)
        resolve(results);
      }).catch((err) => {
        reject(err)
      });
    })
  },

  fetchAvailableSystemDisks() {
    let results = [];

    return new EmberPromise((resolve, reject) => {
      this.fetch('', 'AvailableResource', {
        regionId:             get(this, 'config.region'),
        zoneId:               get(this, 'config.zone'),
        instanceType:         get(this, 'config.instanceType'),
        networkCategory:      'vpc',
        ioOptimized:          'optimized',
        destinationResource:  'SystemDisk'
      }).then((res) => {
        const selectedDisk = get(this, `config.systemDiskCategory`);
        const out = [];

        results = this.getAvailableResources(res);
        DISKS.forEach((disk) => {
          if (results.includes(disk.value)) {
            out.push({
              label: disk.label,
              value: disk.value,
            });
          }
        });

        set(this, 'systemDiskChoices', out);

        if (selectedDisk) {
          const found = get(this, 'systemDiskChoices').findBy('value', selectedDisk);

          if (!found) {
            set(this, 'config.systemDiskCategory', null);
          }
        }
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  fetchAvailabelDataDisks() {
    let results = [];

    return new EmberPromise((resolve, reject) => {
      this.fetch('', 'AvailableResource', {
        regionId:             get(this, 'config.region'),
        zoneId:               get(this, 'config.zone'),
        instanceType:         get(this, `config.instanceType`),
        networkCategory:      'vpc',
        systemDiskCategory:   get(this, 'config.systemDiskCategory'),
        ioOptimized:          'optimized',
        destinationResource:  'DataDisk'
      }).then((res) => {
        const selectedDisk = get(this, 'config.dataDiskCategory');
        const out = [];

        results = this.getAvailableResources(res);
        DISKS.forEach((disk) => {
          if (results.includes(disk.value)) {
            out.push({
              label: disk.label,
              value: disk.value,
            });
          }
        });

        set(this, 'dataDiskChoices', out);

        if (selectedDisk) {
          const found = get(this, 'dataDiskChoices').findBy('value', selectedDisk);

          if (!found) {
            set(this, 'config.dataDiskCategory', null);
          }
        }

        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  getAvailableResources(res) {
    const results = [];
    const zones = res['AvailableZones'];

    if (!zones){
      return results;
    }

    zones.AvailableZone.forEach((zone) => {
      zone['AvailableResources']['AvailableResource'].forEach((resource) => {
        resource['SupportedResources']['SupportedResource'].forEach((support) => {
          if ( support.Status === 'Available' && results.indexOf(support.Value) === -1 ) {
            results.pushObject(support.Value);
          }
        });
      });
    });

    return results;
  },

  loadImages(cb) {
    const resourceGroupId = get(this, 'config.resourceGroupId');
    const externalParams = {
      regionId:             get(this, 'config.region'),
      instanceType:         get(this, 'config.instanceType'),
      imageOwnerAlias:      'system',
      isSupportIoOptimized: true
    };

    if (!!resourceGroupId && resourceGroupId !== '') {
      externalParams.resourceGroupId = resourceGroupId;
    }

    this.fetch('Image', 'Images', externalParams)
      .then((images) => {
        const out = [];

        images.forEach((obj) => {
          if (obj.raw.OSType === 'linux'){
            const versions = this.availableImageVersions(obj.raw.Platform);

            if (versions.find((v) => obj.raw.OSName.indexOf(v) !== -1)){
              out.push({
                label: obj.raw.ImageOwnerAlias === 'system' ? obj.raw.OSName : obj.raw.ImageName,
                value: obj.value,
                raw:   obj.raw,
              });
            }
          }
        });

        set(this, 'images', out.sortBy('label').reverse());

        const imageId = get(this, 'config.imageId');
        let found = get(this, 'images').findBy('value', imageId);

        if (!found ) {
          const ubuntu = get(this, 'images').find((i) => get(i, 'value').startsWith(DEFAULT_IMAGE));
          const defaultImage = ubuntu ? ubuntu.value : get(this, 'images.firstObject.value');

          set(this, 'config.imageId', defaultImage);
        }
        if (cb) {
          set(this, 'step', 3);
          cb();
        }
      })
      .catch((err) => {
        const errors = get(this, 'errors') || [];

        errors.pushObject(err.message || err);
        set(this, 'errors', errors);

        if (cb) {
          cb();
        }

        return;
      });
  },

  toLowerCaseInitial(name){
    return name.charAt(0).toLowerCase() + name.slice(1);
  },

  fetch(resource, plural, externalParams = {}, page = 1) {
    let resourceName = '';

    if (resource){
      resourceName = this.toLowerCaseInitial(resource);
    } else {
      resourceName  = this.toLowerCaseInitial(plural)
    }
    if (resourceName === 'vSwitch'){
      resourceName = 'vswitch'
    }

    let acceptLanguage = 'zh-CN';

    if (get(this, 'intl.locale.firstObject') === 'en-us') {
      acceptLanguage = 'en-US';
    }

    const cloudCredentialId = get(this, 'primaryResource.cloudCredentialId')

    const results = [];
    const location = window.location;
    let req = {};

    const url = `${ location.origin }/meta/ack/${ resourceName }`
    const query = Object.assign({}, externalParams, {
      cloudCredentialId,
      acceptLanguage,
    })

    query.pageSize = PAGE_SIZE;
    query.pageNumber = page;

    req = {
      url:     `${ url }?${ this.getQueryParamsString(query) }`,
      method:  'GET',
    };

    return new EmberPromise((resolve, reject) => {
      if (!cloudCredentialId){
        return resolve(results);
      }

      get(this, 'globalStore').rawRequest(req).then((res) => {
        if (resource === '') {
          return resolve(res.body);
        }

        const current = res.body[`${ plural }`][resource];

        results.pushObjects(current.map((item) => {
          return {
            label: item[`${ resource }Id`],
            value: item[`${ resource }Id`],
            raw:   item,
          };
        }));

        if (res.body.TotalCount > ((PAGE_SIZE * (page - 1)) + current.length)) {
          return this.fetch(resource, plural, externalParams, page + 1)
            .then((array) => {
              results.pushObjects(array);
              resolve(results);
            })
            .catch((err) => {
              reject(get(err, 'body.detail') || err);
            });
        } else {
          resolve(results);
        }
      }).catch((err) => {
        reject(get(err, 'body.detail') || err);
      });
    });
  },

  getSignature(secretAccessKey, params) {
    const CanonicalizedQueryString = this.getQueryParamsString(params, true);
    const StringToSign = `POST&%2F&${ CanonicalizedQueryString }`.replace(/%3A/g, '%253A');

    return AWS.util.crypto.hmac(`${ secretAccessKey }&`, StringToSign, 'base64', 'sha1');
  },

  getQueryParamsString(params, deep = false) {
    const keys = Object.keys(params).sort((a, b) => {
      return a < b ? -1 : 1;
    });

    return keys.map((key) => {
      if (params[key] === undefined) {
        return ''
      }

      return `${ key }${ deep ? encodeURIComponent('=') : '=' }${ encodeURIComponent(params[key]) }`
    }).join(deep ? encodeURIComponent('&') : '&')
  },

  loadLanguage(lang) {
    const translation = languages[lang] || languages['en-us'];
    const intl = get(this, 'intl');

    if (intl.addTranslation) {
      intl.addTranslation(lang, 'nodeDriver.aliyunecs', translation.nodeDriver.aliyunecs);
    } else {
      intl.addTranslations(lang, translation);
    }
    intl.translationsFor(lang);
    set(this, 'refresh', false);
    next(() => {
      set(this, 'refresh', true);
      set(this, 'lanChanged', +new Date());
    });
  },

  upperFirst(string){
    return string.slice(0, 1).toUpperCase() + string.slice(1);
  },

  getAvailableInstanceTypes() {
    this.fetchAvailableInstanceTypes().then((availableResources) => {
      set(this, 'instanceTypes', (get(this, 'allInstanceTypes') || []).filter((instanceType) => availableResources.includes(instanceType.value)).map((instanceType) => {
        return {
          group: instanceType.raw.InstanceTypeFamily,
          value: instanceType.value,
          label: `${ instanceType.raw.InstanceTypeId } ( ${ instanceType.raw.CpuCoreCount } ${ instanceType.raw.CpuCoreCount > 1 ? 'Cores' : 'Core' } ${ instanceType.raw.MemorySize }GB RAM )`,
        }
      }));

      if (!availableResources.includes(get(this, 'config.instanceType'))){
        set(this, 'config.instanceType', '');
      }
    });
  },

  initInstanceChargeType(){
    let instanceChargeType = get(this, 'config.instanceChargeType');

    if (instanceChargeType === 'PrePaid') {
      set(this, 'periodUnit', `${ get(this, 'config.period') }_${ get(this, 'config.periodUnit') }`);
    }
    if (get(this, 'config.spotStrategy') && get(this, 'config.spotStrategy') !== 'NoSpot') {
      instanceChargeType = 'SpotStrategy';
    }
    set(this, 'instanceChargeType', instanceChargeType);
  },

  availableImageVersions(type){
    const support = this.imageVersions.find((obj) => obj.type === type);

    if (support){
      return support.version.split(',');
    }

    return [];
  },

  initOpenPorts(ports) {
    return ports ? ports.join(',') : '';
  },
});
