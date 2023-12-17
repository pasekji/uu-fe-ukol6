import React from 'react';
import ShoppingListPreview from './ShoppingListPreview';
import Members from './Members';
import Items from './Items';
import './styles/ShoppingListWrapper.css';
import { users } from '../data';
import { useTranslation } from 'react-i18next';
import { Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function ShoppingListWrapper({
  setShoppingListData,
  shoppingListData,
  selectedList,
  onDeleteList,
  onSelectList,
  onDeselectList,
  onArchiveToggle,
  currentUser,
  onUpdateItems,
  editingListName,
  onEditListName,
  onUpdateListName,
  onUpdateMembers,
  showArchived,
  onToggleShowArchived
}) {
  const { t } = useTranslation();

    const onItemsUpdate = (updatedItems) => {
        const updatedSelectedList = { ...selectedList, items: updatedItems };
            setShoppingListData(shoppingListData.map(list =>
                list.id === selectedList.id ? updatedSelectedList : list
        ));
    };

  const chartOptions = {
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    animation: {
      duration: 0
    }
  };

  const getChartData = (list) => ({
    labels: [t('itemsSolved'), t('itemsUnsolved')],
    datasets: [
      {
        data: [list.items.filter(item => item.solved).length, list.items.length - list.items.filter(item => item.solved).length],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  });

  return (
    <div className="shopping-list-wrapper">
      {selectedList === null && (
        <div className="archive-toggle-button">
          <button onClick={onToggleShowArchived}>
            {showArchived ? t('showUnarchived') : t('showArchived')}
          </button>
        </div>
      )}
      {selectedList === null ? (
        shoppingListData
          .filter(list => showArchived ? list.archived : !list.archived)
          .map(list => (
            <ShoppingListPreview
              key={list.id}
              list={list}
              onSelect={onSelectList}
              onArchiveToggle={onArchiveToggle}
              onDelete={() => onDeleteList(list.id)}
              currentUserId={currentUser.id}
            />
          ))
      ) : (
        <div>
          {editingListName === selectedList.id ? (
            <input
              type="text"
              defaultValue={selectedList.listName}
              onBlur={(e) => onUpdateListName(selectedList.id, e.target.value)}
            />
          ) : (
            <h2>{selectedList.listName}</h2>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {currentUser.id === selectedList.owner && (
              <button onClick={() => onEditListName(selectedList.id)}>{t('editNameButton')}</button>
            )}
          </div>
          <Members
            memberList={selectedList.members.map(memberId =>
              users.find(user => user.id === memberId)
            )}
            allUsers={users}
            listId={selectedList.id}
            currentUser={currentUser}
            onUpdateMembers={onUpdateMembers}
          />
          <Items
            itemList={selectedList.items}
            currentUser={currentUser}
            listOwner={selectedList.owner}
            listMembers={selectedList.members}
            onUpdateItems={(updatedItems) => onUpdateItems(selectedList.id, updatedItems)}
            listId={selectedList.id}
            onItemsUpdate={onItemsUpdate}
          />
          <div style={{ width: '300px', height: '300px' }}>
            <Doughnut data={getChartData(selectedList)} options={chartOptions} />
          </div>
          <button onClick={onDeselectList}>{t('backButton')}</button>
        </div>
      )}
    </div>
  );
}

export default ShoppingListWrapper;
