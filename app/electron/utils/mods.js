import byteSize from 'byte-size';
import klaw from 'klaw';
import path from 'path';

import { AVAILABLE_IWADS, MOD_EXTENSIONS } from '../constants';
import { getExt } from './common';

const walkWadDir = dir => {
  if (!dir || dir.trim() === '') {
    throw new Error('WAD Directory is not set');
  }

  const mods = [];
  const iwads = [];
  const filter = item => {
    const basename = path.basename(item);
    return basename === '.' || basename[0] !== '.';
  };

  return new Promise((resolve, reject) => {
    return klaw(dir, { depthLimit: -1, filter })
      .on('readable', function() {
        let item;
        while ((item = this.read())) {
          if (item.stats.isFile()) {
            const checkname = path
              .parse(item.path)
              .name.replace(/_/g, ' ')
              .toLowerCase();

            if (AVAILABLE_IWADS.indexOf(checkname) > -1) {
              iwads.push(IWADItem(item));
            } else if (isModFile(item.path)) {
              mods.push(modItem(item, dir));
            }
          }
        }
        iwads.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        });
      })
      .on('end', () => {
        return resolve({
          mods: Object.values(
            mods.reduce((acc, cur) => Object.assign(acc, { [cur.id]: cur }), {})
          ),
          iwads
        });
      })
      .on('error', err => reject(err.message));
  });
};

const getMetaData = (item, dir) => {
  const name = path.parse(item.path).name.replace(/_/g, ' ');
  const ext = getExt(item.path);

  let tags = item.path
    .substring(0, item.path.lastIndexOf(path.sep))
    .replace(`${dir}`, '')
    .toLowerCase()
    .split(path.sep)
    .filter(i => i.trim() !== '');

  if (tags.length > 3) {
    tags = tags.slice(0, 3);
  }

  return {
    id: `${name}${item.stats.size}${ext}`,
    name: name,
    ext: getExt(item.path),
    tags: tags
  };
};

const IWADItem = item => {
  const sz = byteSize(item.stats.size);
  const meta = getMetaData(item);
  return {
    id: meta.id,
    name: meta.name,
    kind: meta.ext,
    path: item.path,
    size: `${sz.value} ${sz.unit}`,
    created: item.stats.birthtimeMs,
    active: false
  };
};

const isModFile = item => {
  const EXT = path
    .parse(item)
    .ext.toUpperCase()
    .trim()
    .substr(1);

  return MOD_EXTENSIONS.indexOf(EXT) > -1;
};

const modItem = (item, dir) => {
  const sz = byteSize(item.stats.size);
  const meta = getMetaData(item, dir);

  return {
    id: meta.id,
    lastdir: path.basename(path.dirname(item.path)).toLowerCase(),
    tags: meta.tags,
    name: meta.name,
    kind: meta.ext,
    path: item.path,
    size: `${sz.value} ${sz.unit}`,
    created: item.stats.birthtimeMs,
    active: false
  };
};

export { modItem, isModFile, walkWadDir };
