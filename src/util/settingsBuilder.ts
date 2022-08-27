export class SettingsItem<T> {
  title: string;
  subtitle?: string;
  options: T[];
  currentValue: T;
  showAsToggle: boolean;
  isDisabled: boolean;
  section: SettingSection;
  setValue: (val: T) => void;

  constructor(
    title: string,
    options: T[],
    currentValue: T,
    isDisabled: boolean,
    section: SettingSection,
    setValue: (val: T) => void,
    subtitle?: string
  ) {
    this.title = title;
    this.options = options;
    this.currentValue = currentValue;
    this.isDisabled = isDisabled;
    this.subtitle = subtitle;
    this.section = section;
    this.setValue = setValue;
    this.showAsToggle = false;
  }

  isToggle() {
    this.showAsToggle = true;
  }

  addItem<T>(
    title: string,
    options: T[],
    currentValue: T,
    setValue: (val: T) => void,
    subtitle?: string
  ) {
    return this.section.addItem(title, options, currentValue, setValue, subtitle);
  }

  filterAccess(access: boolean) {
    this.isDisabled = !access;
    return this;
  }
}

export class SettingSection {
  title: string;
  items: SettingsItem<any>[];
  settings: SettingsBuilder;

  constructor(title: string, settings: SettingsBuilder) {
    this.title = title;
    this.settings = settings;
    this.items = [];
  }

  addItem<T>(
    title: string,
    options: T[],
    currentValue: T,
    setValue: (val: T) => void,
    subtitle?: string
  ) {
    const item = new SettingsItem<T>(title, options, currentValue, false, this, setValue, subtitle);
    this.items.push(item);
    return item;
  }
}

export class SettingsBuilder {
  sections: SettingSection[];
  constructor() {
    this.sections = [];
  }

  addSection(title: string) {
    const section = new SettingSection(title, this);
    this.sections.push(section);
    return section;
  }

  build() {
    return this.sections;
  }
}
