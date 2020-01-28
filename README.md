# Auto Update String to String ID

## 2020_01_20

### Made by ZeroMaster's Second Assist Tools
---
### extensions
```
  extension.updateStringToStringId
  extension.checkStringIdFromString
  extension.checkStringIdToString
```

### commands
```
  {
    title: Update String,
    command: extension.updateStringToStringId
  },
  {
    title: Check String,
    command: extension.checkStringIdFromString
  },
  {
    title: Check String Id,
    command: extension.checkStringIdToString
  }
```

### configuration
```
  update-string-to-string-id: {
    destPath: {
      example: 'Users/document/awesomeProject/foo/bar',
      default: '..'
    },
    destFileName: {
      example: 'Strings.ko.json',
      default: 'Strings.ko.json'
    },
    isAccuratelySearch: {
      example: true/false,
      default: true
    },
    toString: {
      example: 'toLowerCase',
      default: 'none',
      enum: [
        'toLowerCase',
        'toUpperCase',
        'none'
      ],
      *required: reload
    }
  }
```


# release Note
#### v0.0.1
> Initialize project

#### v0.0.2
> Add UpdateStringToStringId

#### v0.0.3
> Add command for using

#### v0.0.5
> Add configuration for destPath, destFileName, isCopyFromCliboard

#### v0.0.7
> Set validation about !editor || !selection || !wrong word

#### v0.1.0
> Add CheckStringIdFromString

#### v0.1.1
> Fix when destFile have comments, smear comments during use extension

#### v0.1.3
> Add checkStringIdFromString then show stringId at vscode quickPick

#### v0.1.4
> Add vscode showInformation message when can't search checkStringIdFromString's result in CheckStringIdFromString

#### v0.1.6
> Rename UpdateStringToStringId from sort-string-to-json

#### v0.1.8
> Do not save clipboard when check function to update

#### v0.2.0
> If selectText is literal string and using ${value}, auto changing by configuration's set word [ MIH localize type ]
> - when use literal grammer check and use by new configuration

#### v0.2.1
> Add toStringCase 
> - toUpperCase
> - toLowerCase
> - none

#### v0.2.2
> Add check the string with modal

---

# Coming Soon

#### auto recommended string id according to new configuration
  - lastFilePath / fileName || className / symbolName / ...

---

# Developer Note
How can I rename extension project!!!