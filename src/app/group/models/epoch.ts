
export class EpochModel {
    name: string;
    isChecked?: boolean;
}

export class EpochGrupModel {
    name: string;
    isChecked?: boolean;
}

export let standartEpoch: EpochModel[] = [] ;
standartEpoch = [
    {name: 'WWI' },
    {name: 'WWII' },
    {name: 'polishBolshevik' },
    {name: '1939' },
    {name: 'antiquity' },
    {name: 'middleAges' },
    {name: 'IRP' },
    {name: 'napoleon' },
    {name: 'november' },
    {name: 'january' },
    {name: 'civilWar' },
    {name: 'warsaw44' },
    {name: 'presentDay' }
];
