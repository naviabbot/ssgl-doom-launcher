import { AnimatePresence } from 'framer-motion';
import React, { useContext, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Box } from '../../components';
import Confirm from '../../components/Confirm';
import { StoreContext } from '../../state';
import {
  sortList,
  useHashLocation,
  useIpc,
  useToast,
  useTranslation
} from '../../utils';
import AnimatedView from '../AnimatedView';
import ObligeModal from './ObligeModal';
import Pack from './Pack';
import PackageFilter from './PackageFilter';

const Packages = () => {
  const { gstate, dispatch } = useContext(StoreContext);
  const [rawFilter, setFilter] = useState('');
  const [sort, setSort] = useState('last');
  const [ipc] = useIpc();
  const onSort = ({ value }) => setSort(value);
  const [confirm, setConfirm] = useState({ id: null, open: false });
  const { t } = useTranslation(['common']);
  const [toast] = useToast();
  // eslint-disable-next-line no-unused-vars
  const [location, navigate] = useHashLocation();
  const [selectedPack, setSelectedPack] = useState(null);
  const [filter] = useDebounce(rawFilter, 200);

  const onDelete = id => () => {
    setConfirm({
      open: true,
      id: id
    });
  };

  const onOk = async () => {
    if (!confirm.id) {
      return;
    }

    const newPackages = await ipc('packages/delete', confirm.id);
    dispatch({ type: 'packages/delete', packages: newPackages });
    setConfirm({
      open: false,
      id: null
    });
  };

  const onCancel = () => {
    setConfirm({
      open: false,
      id: null
    });
  };

  const onPlay = (pack, sourceport) => async () => {
    const newPackages = await ipc('packages/play', {
      pack: pack,
      selected: pack.selected.map(id => gstate.mods.find(mod => id === mod.id)),
      load: true,
      oblige: null
    });

    dispatch({ type: 'packages/save', packages: newPackages, package: null });

    toast(
      'ok',
      t('common:toastStart'),
      t('common:toastStartText', {
        sourceport: sourceport.name,
        num: newPackages.length
      })
    );
  };

  const onData = path => () => ipc('packages/open', { path: path });

  const onUse = id => () => {
    dispatch({ type: 'packages/select', id: id });
    navigate('/');
  };

  const show = sortList(gstate.packages, sort, filter, (i, fuzz) =>
    fuzz(filter, i.name.toLowerCase())
  );

  return (
    <AnimatedView>
      <Box
        fixed={
          <PackageFilter
            sortValue={sort}
            onSort={onSort}
            size={show.length}
            onInput={(e, { value }) => setFilter(value)}
            onClear={() => setFilter('')}
            filterValue={rawFilter}
          />
        }
      >
        <AnimatePresence>
          {show.map(pack => (
            <Pack
              pack={pack}
              key={pack.id}
              onDelete={onDelete}
              onUse={onUse}
              onData={onData}
              onPlay={onPlay}
              onOblige={() => setSelectedPack(pack)}
            />
          ))}
        </AnimatePresence>
        <Confirm active={confirm.open} onOk={onOk} onCancel={onCancel} />
        {gstate.settings.obligeActive ? (
          <ObligeModal
            active={Boolean(selectedPack)}
            toggle={setSelectedPack}
            pack={selectedPack}
          />
        ) : null}
      </Box>
    </AnimatedView>
  );
};
export default Packages;
