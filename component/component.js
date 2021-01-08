/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import NodeDriver from 'shared/mixins/node-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
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
/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const languages = {
  'en-us':   {"nodeDriver":{"aliyunecs":{"accountSection":{"label":"1. Account Access","detail":"API Keys will be used to launch Aliyun ECS Instances.","next":"Next: Authenticate & Config network options","loading":"Loading Regions from Aliyun ECS..."},"accessKey":{"label":"Access Key","placeholder":"Your Aliyun Account Access Key"},"accessKeySecret":{"label":"Access Key Secret","placeholder":"Your Aliyun Account Access Key Secret","provided":"Provided"},"apiEndpoint":{"label":"API Endpoint (Optional)","placeholder":"Private Aliyun API Server Endpoint"},"instanceOptionsSection":{"label":"Instance","detail":"Customize the Aliyun ECS Instance that will be created."},"instanceDescription":{"label":"Instance Description","placeholder":"Instance Description"},"instanceType":{"label":"Instance Type","placeholder":"Instance Type"},"systemImage":{"label":"System image","placeholder":"System image"},"internetMaxBandwidth":{"label":"Internet Max Bandwidth","placeholder":"1 to 100"},"aliyunSLB":{"label":"Aliyun SLB ID","placeholder":"Aliyun SLB ID"},"instanceSection":{"next":"Next: Config Storage Options","loading":"Loading Storage Types from Aliyun ECS..."},"storageSection":{"label":"Storage","detail":"Configure the storage for the instances that will be created by this template.","next":"Next: Config Aliyun ECS Instance options","loading":"Loading Instance Types and Images from Aliyun ECS..."},"ioOptimized":{"label":"Instance Storage I/O Optimized","optimized":"Optimized","none":"None"},"disk":{"cloud":"Ordinary Disk","ephemeralSsd":"Local SSD Disk","efficiency":"Ultra Disk","ssd":"SSD Disk","essd":"ESSD Disk"},"systemDiskCategory":{"label":"System Disk Category"},"systemDiskSize":{"label":"System Disk Size","placeholder":"Disk Capacity: 20 ~ 500"},"dataDiskCategory":{"label":"Data Disk Category"},"dataDiskSize":{"label":"Data Disk Size","placeholder":"Disk Capacity: 20 ~ 32768"},"resourceGroup":{"label":"Resource Group","all":"Account's all Resources"},"region":{"label":"Region","placeholder":"Region"},"zone":{"label":"Available Zone","prompt":"Choose a Available Zone..."},"networkSection":{"label":"Network","detail":"Configure the network for the instances that will be created by this template.","next":"Next: Config Aliyun ECS Instance options","loading":"Loading Instance Types and Images from Aliyun ECS..."},"routeCIDR":{"label":"Route CIDR","placeholder":"e.g. 192.168.1.0/24"},"vpcId":{"label":"VPC","prompt":"Choose a VPC...","default":"Default VPC"},"vswitchId":{"label":"VSwitch","prompt":"Choose a VSwitch...","default":"Default VSwitch"},"privateIp":{"label":"Private IP","placeholder":"Private IP in Private Network"},"privateAddressOnly":{"label":"Private Address Only"},"internetChargeType":{"label":"Bandwidth Billing","prompt":"Choose Bandwidth Billing..."},"internetChargeTypes":{"payByTraffic":"Pay-By-Traffic","payByBandwidth":"Pay-By-Bandwidth"},"securitySection":{"label":"Security","detail":"Choose the security groups that will be applied to Instances"},"securityGroup":{"label":"Security Group","placeholder":"Security Group","prompt":"Choose a Security Group...","defaultCreate":"Automatically create a <code>{groupName}</code> group"},"sshPassword":{"label":"SSH Password","placeholder":"Set Instance SSH Password (Optional)","provided":"Provided"},"tags":{"addActionLabel":"Add Instance Tag","valueLabel":"Tags","placeholder":"e.g. dev"},"errors":{"nameRequired":"Name is required","zoneIdRequired":"Available Zone is required.","vpcIdRequired":"VPC is required.","vswitchIdRequired":"VSwitch is required.","imageIdRequired":"Image is required.","accessKeyRequired":"Access Key is required.","accessSecretRequired":"Access Secret Key is required.","sshPasswordLengthNotValid":"The length of SSH password must between eight and thirty.","sshPasswordInvalidCharacter":"SSH password contains invalid characters.","sshPasswordFormatError":"SSH password must contain at least three out of four kinds of following characters: uppercase letter, lowercase letters, numbers, and special characters.","nameNotValidForApp":"The name is invalid according to the {appName} hostname rule."}}}},
  'zh-hans': {"nodeDriver":{"aliyunecs":{"accountSection":{"label":"1. 访问令牌","detail":"配置用于创建阿里云主机的访问令牌","next":"下一步: 认证&配置网络","loading":"正在获取阿里云区域信息..."},"accessKey":{"label":"访问秘钥","placeholder":"阿里云访问秘钥"},"accessKeySecret":{"label":"访问秘钥令牌","placeholder":"阿里云访问秘钥所对应的令牌","provided":"已提供"},"apiEndpoint":{"label":"(可选)阿里云私有部署API地址","placeholder":"阿里云私有部署API地址"},"instanceOptionsSection":{"label":"实例","detail":"设置即将创建的阿里云实例"},"instanceDescription":{"label":"实例描述","placeholder":"该实例的描述"},"instanceType":{"label":"实例类型","placeholder":"实例类型"},"systemImage":{"label":"系统镜像","placeholder":"系统镜像"},"internetMaxBandwidth":{"label":"最大网络带宽","placeholder":"1到100"},"aliyunSLB":{"label":"阿里云SLB ID","placeholder":"阿里云SLB ID"},"instanceSection":{"next":"下一步: 配置存储选项","loading":"正在获取阿里云存储类型..."},"storageSection":{"label":"存储","detail":"配置通过该模版创建的实例的存储选项","next":"下一步: 配置阿里云实例选项","loading":"正在获取主机类型和系统镜像..."},"ioOptimized":{"label":"存储IO优化","optimized":"优化","none":"不优化"},"disk":{"cloud":"普通云盘","ephemeralSsd":"本地SSD盘","efficiency":"高效云盘","ssd":"SSD 云盘","essd":"ESSD 云盘"},"systemDiskCategory":{"label":"系统盘种类"},"systemDiskSize":{"label":"系统磁盘大小","placeholder":"容量范围: 20 ~ 500"},"dataDiskCategory":{"label":"数据盘种类"},"dataDiskSize":{"label":"数据磁盘大小","placeholder":"容量范围: 0 ~ 32768"},"resourceGroup":{"label":"资源组","all":"账号全部资源"},"region":{"label":"区域","placeholder":"区域"},"zone":{"label":"可用区","prompt":"选择可用区..."},"networkSection":{"label":"网络","detail":"配置通过该模版创建的实例的网络选项","next":"下一步: 配置阿里云实例选项","loading":"正在获取主机类型和系统镜像..."},"routeCIDR":{"label":"路由CIDR","placeholder":"例如: 192.168.1.0/24"},"vpcId":{"label":"专有网络","prompt":"选择专有网络...","default":"默认专有网络"},"vswitchId":{"label":"交换机","prompt":"选择交换机...","default":"默认交换机"},"privateIp":{"label":"私有IP","placeholder":"专用网络中的私有 IP"},"privateAddressOnly":{"label":"仅私网IP"},"internetChargeType":{"label":"带宽计费模式","prompt":"选择计费模式..."},"internetChargeTypes":{"payByTraffic":"按使用流量计费","payByBandwidth":"按固定带宽计费"},"securitySection":{"label":"安全","detail":"选择实例所需要配置的安全组。"},"securityGroup":{"label":"安全组","placeholder":"安全组","prompt":"选择安全组...","defaultCreate":"自动创建<code>{groupName}</code>安全组。"},"sshPassword":{"label":"SSH密码","placeholder":"创建实例后SSH远程登录密码(非必填)","provided":"已提供"},"tags":{"addActionLabel":"添加实例标签","valueLabel":"标签","placeholder":"例如: dev"},"errors":{"nameRequired":"模板名称必须输入","zoneIdRequired":"请选择可用区","vpcIdRequired":"请选择专有网络","vswitchIdRequired":"请选择交换机","imageIdRequired":"请选择镜像","accessKeyRequired":"请输入访问秘钥","accessSecretRequired":"请输入访问秘钥令牌","sshPasswordLengthNotValid":"SSH密码的长度应为8至30之间","sshPasswordInvalidCharacter":"SSH密码包含非法字符","sshPasswordFormatError":"SSH密码必须至少包括大写字符，小写字符，数字和特殊字符中的三种","nameNotValidForApp":"根据{appName}主机名规则该名称无效。"}}}}
};
const ENDPOINT = 'https://ecs.aliyuncs.com';
const RESOURCE_GROUP_ENDPOINT = 'resourcemanager.aliyuncs.com';
const VPC_ENDPOINT = 'vpc.aliyuncs.com';
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
  }
];
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


/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(NodeDriver, {
  driverName: '%%DRIVERNAME%%',
  config:     alias('model.%%DRIVERNAME%%Config'),
  app:        service(),
  router:     service(),
  session:    service(),

  configField:   'aliyunecsConfig',
  zones:          null,
  regions:        null,
  securityGroups: [],
  images:         null,
  instanceTypes:  null,

  resourceGroups:       null,
  resourceGroupChoices: null,

  systemDiskChoices: [],
  dataDiskChoices:   [],

  step:      1,

  lanChanged:    null,
  refresh:       false,

  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template      = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'nodes/components/driver-%%DRIVERNAME%%/template'
    });
    set(this,'layout', template);

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
      });

      set(this, 'model.engineInstallURL', 'https://drivers.rancher.cn/pandaria/docker-install/19.03-aliyun.sh');
      set(this,'model.engineStorageDriver', 'overlay2');
      set(this, 'model.%%DRIVERNAME%%Config', config);
    }

  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

  actions: {
    async alyLogin(cb) {
      setProperties(this, {
        'errors':                 null,
        'config.accessKeyId':     (get(this, 'config.accessKeyId') || '').trim(),
        'config.accessKeySecret': (get(this, 'config.accessKeySecret') || '').trim(),
      });

      const errors = [];
      const intl = get(this, 'intl');

      const accessKey = get(this, 'config.accessKeyId');
      const accessSecret = get(this, 'config.accessKeySecret');

      if (!accessKey) {
        errors.push(intl.t('nodeDriver.aliyunecs.errors.accessKeyRequired'));
      }

      if (!accessSecret) {
        errors.push(intl.t('nodeDriver.aliyunecs.errors.accessSecretRequired'));
      }

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      try {
        await all([this.fetchResourceGroups(), this.fetchRegions()]);
        this.regionDidChange();
        set(this, 'step', 2);
        cb();
      } catch (e) {
        errors.push(get(e, 'body.Message') || e);
        set(this, 'errors', errors);
        cb();

        return;
      }
    },

    loadStorageTypes(cb) {
      set(this, 'errors', null);

      const errors = get(this, 'errors') || [];
      const intl = get(this, 'intl');

      const imageId = get(this, 'config.imageId');

      if ( !imageId ) {
        errors.push(intl.t('nodeDriver.aliyunecs.errors.imageIdRequired'));
      }

      if ( errors.length > 0 ) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      set(this, 'step', 4);
      cb();
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
        cb();

        return;
      }

      if (!get(this, 'config.securityGroup')) {
        set(this, 'config.securityGroup', 'docker-machine')
      }

      this.fetch('InstanceType', 'InstanceTypes', { RegionId: get(this, 'config.region') })
        .then((instanceTypes) => {
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
          cb();

          return;
        });
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
      RegionId: get(this, 'config.region'),
      vpcId: get(this, 'config.vpcId')
    };

    if (!!resourceGroupId && resourceGroupId !== '') {
      externalParams.ResourceGroupId = resourceGroupId;
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
      RegionId: get(this, 'config.region'),
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

      if(securityGroupsPromise === undefined) {
        return;
      }

      securityGroupsPromise.then((securityGroups) => {
        set(this, 'securityGroups', securityGroups.map((securityGroup) => {
          let label = `${ securityGroup.raw.SecurityGroupName } (${ securityGroup.value })`

          return {
            ...securityGroup,
            label
          };
        }));
        const selectedSecurityGroup = get(this, 'config.securityGroup');

        if (selectedSecurityGroup) {
          const found = securityGroups.findBy('value', selectedSecurityGroup);

          if (!found) {
            set(this, 'config.securityGroup', 'docker-machine');
          }
        }
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
    const externalParams = {
      RegionId: region,
    };

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

      this.fetch('Zone', 'Zones', { RegionId: get(this, 'config.region') }).then((zones) => {
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

  instanceTypeDidChange:observer('config.instanceType', function() {
    this.loadImages();
    this.fetchAvailableSystemDisks();
    this.fetchAvailabelDataDisks();
  }),

  systemDiskDidChange: observer('config.systemDiskCategory', function() {
    this.fetchAvailabelDataDisks();
  }),

  internetChargeTypes: computed('intl.locale', function() {
    const intl = get(this, 'intl');

    return OPT_CHARGETYPES.map((item) => ({
      ...item,
      label: intl.t(item.label),
    }));
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
    const regionId = get(this,'config.region');
    const regions = get(this, 'regions') || [];

    if (regionId && regions.length > 0) {
       return get(regions.findBy('value', regionId), 'label')
    } else {
      return ''
    }
  }),
  
  zoneShowValue: computed('intl.locale', 'config.zone', 'zones.[]', function() {
    const zoneId = get(this,'config.zone');
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

    if (securityGroup === 'docker-machine') {
      return securityGroup
    }

    if (securityGroups && securityGroups.length > 0 && securityGroup) {
      return get(securityGroups.findBy('value', securityGroup), 'label');
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
        raw: group.raw
      };
    }));
  },

  async fetchRegions(cb) {
    let AcceptLanguage = 'zh-CN';

    if (get(this, 'intl.locale')[0] === 'en-us') {
      AcceptLanguage = 'en-US';
    };

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
      RegionId:           region,
      SystemDiskCategory: get(this, 'config.systemDiskCategory'),
      DataDiskCategory:   get(this, 'config.diskCategory'),
      DestinationResource: 'InstanceType'
    };

    if ( get(this, 'config.zone') ) {
      params['ZoneId'] = get(this, 'config.zone');
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
        RegionId:             get(this, 'config.region'),
        ZoneId:               get(this, 'config.zone'),
        InstanceType:         get(this, 'config.instanceType'),
        NetworkCategory:      'vpc',
        IoOptimized:          'optimized',
        DestinationResource:  'SystemDisk'
      }).then((res) => {
        const selectedDisk = get(this, `config.systemDiskCategory`);

        results = this.getAvailableResources(res);
        set(this, 'systemDiskChoices', results.map((item) => {
          let disk = DISKS.find(disk => disk.value === item);

          return {
            value: item,
            label: disk.label
          };
        }));

        if (selectedDisk) {
          const found = get(this, 'systemDiskChoices').findBy('value', selectedDisk);

          if (!found) {
            set(this, `config.${ prefix }SystemDiskCategory`, null);
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
        RegionId:             get(this, 'config.region'),
        ZoneId:               get(this, 'config.zone'),
        InstanceType:         get(this, `config.instanceType`),
        NetworkCategory:      'vpc',
        SystemDiskCategory:   get(this, 'config.systemDiskCategory'),
        IoOptimized:          'optimized',
        DestinationResource:  'DataDisk'
      }).then((res) => {
        const selectedDisk = get(this, 'config.dataDiskCategory');

        results = this.getAvailableResources(res);
        set(this, 'dataDiskChoices', results.map((item) => {
          let disk = DISKS.find(disk => disk.value === item);
          if (disk === undefined) {
            return null;
          }
          return {
            value: item,
            label: disk.label
          };
        }));

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
      RegionId: get(this, 'config.region'),
      InstanceType: get(this, 'config.instanceType'),
      ImageOwnerAlias: 'system',
      IsSupportIoOptimized: true
    };

    if (!!resourceGroupId && resourceGroupId !== '') {
      externalParams.ResourceGroupId = resourceGroupId;
    }

    this.fetch('Image', 'Images', externalParams)
      .then((images) => {
        set(this, 'images', images.filter((image) => {
          return image.raw.OSType === 'linux';
        }).map((image) => {
          return {
            label: image.raw.ImageOwnerAlias === 'system' ? image.raw.OSName : image.raw.ImageName,
            value: image.value,
            raw:   image.raw,
          }
        }));
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

  fetch(resource, plural, externalParams = {}, page = 1) {
    const results = [];
    const location = window.location;
    let endpoint = get(this, 'config.apiEndpoint') ? get(this, 'config.apiEndpoint') : ENDPOINT;
    const AccessKeyId = get(this, 'config.accessKeyId');
    const secretAccessKey = get(this, 'config.accessKeySecret');
    const date = new Date();
    let req = {};
    let params = Object.assign({}, externalParams, {
      AccessKeyId,
      Action:           `Describe${ plural }`,
      Format:           'JSON',
      SignatureMethod:  'HMAC-SHA1',
      SignatureNonce:   String(date.getTime()) + String(Math.random()).substring(2, 6),
      SignatureVersion: '1.0',
      Timestamp:        date.toISOString(),
      Version:          '2014-05-26',
    });

    if (get(this, 'app.proxyEndpoint') === undefined) {
      return;
    }

    if(plural === 'Vpcs' || plural === 'VSwitches') {
      params.Version = '2016-04-28';
      endpoint = VPC_ENDPOINT;
    }

    if (plural === 'ResourceGroups') {
      params.Action  = 'ListResourceGroups';
      params.Version = '2020-03-31';
      endpoint = RESOURCE_GROUP_ENDPOINT;
    }

    params.PageSize = PAGE_SIZE;
    params.PageNumber = page;
    params.Signature = this.getSignature(secretAccessKey, params);

    endpoint = `${ get(this, 'app.proxyEndpoint')  }/${  endpoint.replace('//', '/') }`;
    endpoint = `${ location.origin }${ endpoint }`;

    req = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      url:     endpoint,
      method:  'POST',
      body:    this.getQueryParamsString(params)
    }

    return new EmberPromise((resolve, reject) => {
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
          const promise = this.fetch(resource, plural, externalParams, page + 1);
          if(promise === undefined) {
            return;
          }
          return promise
            .then((array) => {
              results.pushObjects(array);
              resolve(results);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          resolve(results);
        }
      }).catch((err) => {
        reject(err)
      });
    })
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
});
